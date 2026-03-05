from django.db import models
from django.template.defaultfilters import slugify
from django.contrib.auth.models import User

class Game(models.Model):
    MAX_NAME = 128

    name = models.CharField(max_length=MAX_NAME, unique=True)
    slug = models.SlugField(unique=True)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Game, self).save(*args, **kwargs)

    def __str__(self):
        return self.name

class Review(models.Model):
    MAX_TEXT = 1000

    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    text = models.TextField(max_length=MAX_TEXT)

    def __str__(self):
        return self.text
    
    
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    picture = models.ImageField(upload_to="profile_images", blank=True)

    def __str__(self):
        return self.user.username