import json
import logging
import os
import sys

# Add backend directory to sys.path so we can import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database.database import SessionLocal
from database.models import Course, Title, Content, Question

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def import_data(json_file_path):
    # Open a new database session
    db = SessionLocal()
    
    try:
        with open(json_file_path, 'r') as file:
            data = json.load(file)
            
        # Iterate over real courses from the JSON
        for course_data in data.get("courses", []):
            course_name = course_data.get("name")
            course_desc = course_data.get("description")
            
            new_course = Course(name=course_name, description=course_desc)
            db.add(new_course)
            db.commit()
            db.refresh(new_course)
            logger.info(f"Created Course: {new_course.name} (ID: {new_course.id})")

            # Iterate over modules (titles) for this course
            for module_data in course_data.get("modules", []):
                module_title = module_data.get("title")
                module_content = module_data.get("lessons")
                module_questions = module_data.get("quiz", [])
                
                # 1. Create Title
                new_title = Title(name=module_title, course_id=new_course.id)
                db.add(new_title)
                db.commit()
                db.refresh(new_title)
                logger.info(f"  Created Module: {new_title.name} (ID: {new_title.id})")
                
                # 2. Create Content
                # Support passing an array of strings as content to map to our bullet points
                if isinstance(module_content, list):
                    for content_line in module_content:
                        new_content = Content(text_body=content_line, title_id=new_title.id)
                        db.add(new_content)
                    db.commit()
                    logger.info(f"    Added {len(module_content)} content lines for Module ID: {new_title.id}")
                elif module_content:
                    new_content = Content(text_body=module_content, title_id=new_title.id)
                    db.add(new_content)
                    db.commit()
                    logger.info(f"    Added content for Module ID: {new_title.id}")
                    
                # 3. Create Questions
                for q in module_questions:
                    options_list = q.get("options", [])
                    options_str = json.dumps(options_list) if options_list else None
                    new_question = Question(
                        question_text=q.get("question"),
                        answer_text=q.get("answer"),
                        options=options_str,
                        title_id=new_title.id
                    )
                    db.add(new_question)
                    db.commit()
                    logger.info(f"    Added question: '{new_question.question_text}'")

        logger.info("Import completed successfully!")
        
    except Exception as e:
        logger.error(f"Error during import: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Get path to import.json
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_file = os.path.join(base_dir, "data", "import.json")
    
    import_data(data_file)
