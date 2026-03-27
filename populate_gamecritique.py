import os
import re
os.environ.setdefault('DJANGO_SETTINGS_MODULE',
                      'WAD2_GroupProject.settings')

import django
import requests
import time
django.setup()
from gamecritique.models import Comment, Game, Review, Tag, UserProfile, User 

STEAMSPY_URL = "https://steamspy.com/api.php?request=top100forever" # Get the top 100 most popular games of all time using SteamSpy's API
APPDETAILS_URL = "https://store.steampowered.com/api/appdetails?appids={appid}" # Get details of these games using Steam API

def get_top_100_forever():
    response = requests.get(STEAMSPY_URL)
    return response.json() # Return dictionary where keys are appids as strings
    
def get_app_details(appid):
    url = APPDETAILS_URL.format(appid=appid) # Replaces {appid} with actual appid
    response = requests.get(url)
    data = response.json() 
    element = data.get(appid)
    if not element.get("success"):
        return None
    return element["data"] # Returns data block for appid if data exists

def makeUser():
    user, created = User.objects.get_or_create(
        username = "GamerTiyas",
        defaults = {
            'email': "tiyas@gaming.com"
        }
    )

    if created:
        user.set_password("ILoveRedDead")
        user.save()

    return user

def addReviewsAndComments(user):
    game = Game.objects.first()

    if game:
        review, created = Review.objects.get_or_create(
            game = game,
            user = user,
            defaults = {
                'content': "Wowee",
                'rating': 3
            }
        )
        comment, created = Comment.objects.get_or_create(
            review = review,
            user = user,
            defaults = {
                'content': "Zowee"
            } 
        )

def populate():
    top_100_forever = get_top_100_forever()
    appids = list(top_100_forever)
    for appid in appids:
        details = get_app_details(appid)
        if details.get("type") == "game": # If appid is linked to game (and not DLC or something else)
            name = details.get("name")
            desc = details.get("short_description")
            game, created = Game.objects.get_or_create(name=name, defaults={"description": desc})
            image = details.get("header_image") # Image for game
            game.image_url = image
            game.save()
            release_date = details.get("release_date")
            date = release_date.get("date", "")
            release_year = None
            if len(date) >= 4:
                release_year = None
                match = re.search(r'\d{4}', date)
                if match:
                    release_year = int(match.group())
            game.release_year = release_year
            game.save()

            genres = details.get("genres")
            for genre in genres:
                tag = genre["description"]
                tag, created = Tag.objects.get_or_create(name=tag)
                game.tags.add(tag)
            time.sleep(0.3) # To not overwhelm API

    user = makeUser()
    addReviewsAndComments(user)
    
# Start execution here!
if __name__ == '__main__':
    print('Starting GameCritique population script...')
    populate()