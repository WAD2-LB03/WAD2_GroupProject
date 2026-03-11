import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE',
                      'WAD2_GroupProject.settings')

import django
import requests
import time
django.setup()
from gamecritique.models import Game, Tag

STEAMSPY_URL = "https://steamspy.com/api.php?request=top100forever"
APPDETAILS_URL = "https://store.steampowered.com/api/appdetails?appids={appid}"

def get_top_100_forever():
    response = requests.get(STEAMSPY_URL)
    return response.json()
    
def get_app_details(appid):
    url = APPDETAILS_URL.format(appid=appid)
    response = requests.get(url)
    data = response.json()
    element = data.get(appid)
    if not element.get("success"):
        return None
    return element["data"]

def populate():
    top_100_forever = get_top_100_forever()
    appids = list(top_100_forever)
    for appid in appids:
        details = get_app_details(appid)
        if details.get("type") == "game":
            name = details.get("name")
            desc = details.get("short_description")
            game, created = Game.objects.get_or_create(name=name, defaults={"description": desc})

            genres = details.get("genres")
            for genre in genres:
                tag = genre["description"]
                tag, created = Tag.objects.get_or_create(name=tag)
                game.tags.add(tag)
            time.sleep(0.3)
    
# Start execution here!
if __name__ == '__main__':
    print('Starting GameCritique population script...')
    populate()