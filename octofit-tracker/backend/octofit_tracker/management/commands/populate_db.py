from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from djongo import models
from octofit_tracker import models as app_models

from pymongo import MongoClient

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Connect to MongoDB directly for index creation
        client = MongoClient('localhost', 27017)
        db = client['octofit_db']
        db.users.drop()
        db.teams.drop()
        db.activities.drop()
        db.leaderboard.drop()
        db.workouts.drop()
        # Ensure unique index on email
        db.users.create_index([('email', 1)], unique=True)

        # Sample users (superheroes)
        users = [
            {"name": "Clark Kent", "email": "superman@dc.com", "team": "DC"},
            {"name": "Bruce Wayne", "email": "batman@dc.com", "team": "DC"},
            {"name": "Diana Prince", "email": "wonderwoman@dc.com", "team": "DC"},
            {"name": "Tony Stark", "email": "ironman@marvel.com", "team": "Marvel"},
            {"name": "Steve Rogers", "email": "captain@marvel.com", "team": "Marvel"},
            {"name": "Natasha Romanoff", "email": "blackwidow@marvel.com", "team": "Marvel"},
        ]
        db.users.insert_many(users)

        # Teams
        teams = [
            {"name": "Marvel", "members": [u["email"] for u in users if u["team"] == "Marvel"]},
            {"name": "DC", "members": [u["email"] for u in users if u["team"] == "DC"]},
        ]
        db.teams.insert_many(teams)

        # Activities
        activities = [
            {"user_email": "superman@dc.com", "activity": "Flying", "duration": 120},
            {"user_email": "batman@dc.com", "activity": "Martial Arts", "duration": 90},
            {"user_email": "ironman@marvel.com", "activity": "Flight Suit Training", "duration": 60},
            {"user_email": "captain@marvel.com", "activity": "Shield Throwing", "duration": 45},
        ]
        db.activities.insert_many(activities)

        # Leaderboard
        leaderboard = [
            {"team": "Marvel", "points": 300},
            {"team": "DC", "points": 250},
        ]
        db.leaderboard.insert_many(leaderboard)

        # Workouts
        workouts = [
            {"name": "Super Strength", "suggested_for": ["superman@dc.com", "captain@marvel.com"]},
            {"name": "Stealth Ops", "suggested_for": ["batman@dc.com", "blackwidow@marvel.com"]},
        ]
        db.workouts.insert_many(workouts)

        self.stdout.write(self.style.SUCCESS('octofit_db database populated with test data.'))
