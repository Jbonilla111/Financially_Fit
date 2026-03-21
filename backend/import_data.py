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
            
        # Create a single default course to hold these modules, or treat each item as a course.
        # Given the JSON structure "courses" array, let's treat each object as a Course.
        # But our schema is Course -> Titles -> Content/Questions.
        # So we'll map JSON "title" to a Database "Course" with one "Title" inside it,
        # OR a single "Course" holding multiple "Titles". Let's create one master course.
        
        master_course = Course(name="Financial Literacy 101", description="Foundational financial concepts")
        db.add(master_course)
        db.commit()
        db.refresh(master_course)
        
        logger.info(f"Created Master Course: {master_course.name} (ID: {master_course.id})")

        for item in data.get("courses", []):
            item_title = item.get("title")
            item_content = item.get("content")
            item_questions = item.get("questions", [])
            
            # 1. Create Title
            new_title = Title(name=item_title, course_id=master_course.id)
            db.add(new_title)
            db.commit()
            db.refresh(new_title)
            logger.info(f"  Created Title: {new_title.name} (ID: {new_title.id})")
            
            # 2. Create Content
            if item_content:
                new_content = Content(text_body=item_content, title_id=new_title.id)
                db.add(new_content)
                db.commit()
                logger.info(f"    Added content for Title ID: {new_title.id}")
                
            # 3. Create Questions
            for q in item_questions:
                new_question = Question(
                    question_text=q.get("question"),
                    answer_text=q.get("answer"),
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
