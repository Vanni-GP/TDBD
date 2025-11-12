from fastapi import FastAPI, Depends, HTTPException
import services, models, schemas
from db import get_db, engine
from sqlalchemy.orm import Session

# Crear las tablas si no existen
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Servidor activo 🔥"}

@app.get("/books/", response_model=list[schemas.Book])
def get_all_books(db: Session = Depends(get_db)):
    return services.get_books(db)

@app.get("/books/{id}", response_model=schemas.Book)
def get_book_id(id: int, db: Session = Depends(get_db)):
    book_queryset = services.get_book(db, id)
    if book_queryset:
        return book_queryset
    raise HTTPException(status_code=404, detail="Invalid book id Provided")

@app.post("/books/", response_model=schemas.Book)
def create_new_book(book: schemas.BookCreate, db: Session = Depends(get_db)):
    return services.create_book(db, book)

@app.put("/books/{id}", response_model=schemas.Book)
def update_book(book: schemas.BookCreate, id: int, db: Session = Depends(get_db)):
    db_update = services.update_book(db, book, id)
    if not db_update:
        raise HTTPException(status_code=404, detail="Book Not Found")
    return db_update

@app.delete("/books/{id}", response_model=schemas.Book)
def delete_book(id: int, db: Session = Depends(get_db)):
    delete_entry = services.delete_book(db, id)
    if delete_entry:
        return delete_entry
    raise HTTPException(status_code=404, detail="Book Not Found")

from fastapi import status

from sqlalchemy import text
from fastapi import status

@app.post("/reset/", status_code=status.HTTP_200_OK)
def reset_table(db: Session = Depends(get_db)):
    db.execute(text("TRUNCATE TABLE books RESTART IDENTITY CASCADE;"))
    db.commit()
    return {"message": "Tabla reiniciada y contador de ID reiniciado"}