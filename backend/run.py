from app import create_app, db
import os

app = create_app()

@app.cli.command()
def create_db():
    """Créer toutes les tables de la base de données"""
    db.create_all()
    print("Base de données créée avec succès!")

@app.cli.command()
def init_db():
    """Initialiser la base de données avec des données de test"""
    from app.models.association import Association
    from app.models.member import Member
    from app import bcrypt
    
    # Créer les tables
    db.create_all()
    
    # Créer une association de test
    test_association = Association(
        name="Association des Jeunes Développeurs",
        sigle="AJD",
        email="admin@ajd.com",
        phone="+221 123 456 789",
        password_hash=bcrypt.generate_password_hash("password").decode('utf-8'),
        description="Association pour la promotion du développement logiciel"
    )
    
    db.session.add(test_association)
    db.session.commit()
    
    # Créer des membres de test
    test_members = [
        Member(
            first_name="Mamadou",
            last_name="Diallo",
            email="mamadou.diallo@email.com",
            phone="+221 123 456 789",
            role="PRESIDENT",
            status="ACTIVE",
            association_id=test_association.id
        ),
        Member(
            first_name="Fatou",
            last_name="Camara",
            email="fatou.camara@email.com",
            phone="+221 987 654 321",
            role="SECRETARY",
            status="ACTIVE",
            association_id=test_association.id
        )
    ]
    
    for member in test_members:
        db.session.add(member)
    
    db.session.commit()
    print("Base de données initialisée avec succès!")

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_ENV") == "development"
    app.run(debug=debug, port=port)
