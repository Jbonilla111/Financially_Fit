import json
import logging
import os
import sys
from glob import glob

# Add backend directory to sys.path so we can import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database.database import SessionLocal
from database.models import Calculator, Content, Course, Question, Title

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def _to_json_string(value):
    if value is None:
        return None
    return json.dumps(value)


def _validate_standardized_payload(data, source):
    required_keys = ["module", "lessons", "calculators", "quizzes"]
    missing = [key for key in required_keys if key not in data]
    if missing:
        raise ValueError(f"Missing required keys {missing} in {source}")

    if not isinstance(data["module"], dict):
        raise ValueError(f"'module' must be an object in {source}")

    for key in ["lessons", "calculators", "quizzes"]:
        if not isinstance(data[key], list):
            raise ValueError(f"'{key}' must be an array in {source}")


def import_data(json_file_path):
    db = SessionLocal()

    try:
        with open(json_file_path, "r") as file:
            try:
                data = json.load(file)
            except json.JSONDecodeError as exc:
                logger.warning(f"Skipping {json_file_path}: invalid JSON ({exc})")
                return

        try:
            _validate_standardized_payload(data, json_file_path)
        except ValueError as exc:
            logger.warning(f"Skipping {json_file_path}: {exc}")
            return

        module_data = data["module"]
        module_key = module_data.get("id")
        existing_course = None
        if module_key:
            existing_course = db.query(Course).filter(Course.module_key == module_key).first()

        if existing_course:
            logger.info(
                f"Skipping {json_file_path}: course with module_key '{module_key}' already exists"
            )
            return

        course = Course(
            name=module_data.get("title"),
            description=module_data.get("description"),
            module_key=module_key,
            difficulty_level=module_data.get("difficulty_level"),
            estimated_completion_time=module_data.get("estimated_completion_time"),
            prerequisites=_to_json_string(module_data.get("prerequisites", [])),
            learning_objectives=_to_json_string(module_data.get("learning_objectives", [])),
        )
        db.add(course)
        db.flush()

        lessons_sorted = sorted(data["lessons"], key=lambda lesson: lesson.get("order", 0))
        for lesson in lessons_sorted:
            title = Title(
                name=lesson.get("title"),
                course_id=course.id,
                lesson_key=lesson.get("lesson_id"),
                content_type=lesson.get("content_type"),
                lesson_order=lesson.get("order"),
                key_concepts=_to_json_string(lesson.get("key_concepts", [])),
            )
            db.add(title)
            db.flush()

            db.add(
                Content(
                    text_body=lesson.get("content", ""),
                    title_id=title.id,
                )
            )

        for calculator in data["calculators"]:
            db.add(
                Calculator(
                    calculator_id=calculator.get("calculator_id"),
                    title=calculator.get("title"),
                    inputs=_to_json_string(calculator.get("inputs", [])),
                    outputs=_to_json_string(calculator.get("outputs", [])),
                    course_id=course.id,
                )
            )

        for quiz in data["quizzes"]:
            quiz_id = quiz.get("quiz_id")
            quiz_title = quiz.get("title")
            for question in quiz.get("questions", []):
                options = question.get("options", [])
                correct_answer_index = question.get("correct_answer")
                answer_text = None
                if isinstance(correct_answer_index, int) and 0 <= correct_answer_index < len(options):
                    answer_text = options[correct_answer_index]

                db.add(
                    Question(
                        question_text=question.get("question"),
                        answer_text=answer_text,
                        options=_to_json_string(options),
                        explanation=question.get("explanation"),
                        correct_answer_index=correct_answer_index,
                        quiz_id=quiz_id,
                        quiz_title=quiz_title,
                        title_id=None,
                        course_id=course.id,
                    )
                )

        db.commit()
        logger.info(f"Imported standardized course data from {json_file_path}")

    except Exception as e:
        logger.error(f"Error during import for {json_file_path}: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    candidate_dirs = []

    env_dir = os.getenv("IMPORT_DATA_DIR")
    if env_dir:
        candidate_dirs.append(env_dir)

    candidate_dirs.extend(
        [
            os.path.normpath(os.path.join(base_dir, "..", "frontend", "src", "data")),
            "/seed-data",
        ]
    )

    frontend_data_dir = next((path for path in candidate_dirs if os.path.isdir(path)), None)
    if not frontend_data_dir:
        raise FileNotFoundError(
            f"Could not find data directory. Checked: {', '.join(candidate_dirs)}"
        )

    json_files = sorted(glob(os.path.join(frontend_data_dir, "*.json")))
    if not json_files:
        raise FileNotFoundError(f"No JSON files found in: {frontend_data_dir}")

    for json_file in json_files:
        try:
            import_data(json_file)
        except ValueError as exc:
            logger.warning(f"Skipping {json_file}: {exc}")
