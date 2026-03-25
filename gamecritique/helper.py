from django.db.models import Count

import re

# Returns list of tags from string with '#' and ',' seperators 
def parseTags(search):
    tags = re.split(r'[,#]+', search.lower())  # Makes it all lowercase, then splits it on ',' and '#'
    return [tag.strip() for tag in tags if tag]  # Removes empty entries & removes beginning and end whitespace

# Orders games from most to least reviews
def mostPopular(games):
    return games.annotate(review_count=Count('review')).order_by('-review_count')