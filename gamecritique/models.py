from django.db import models
from django.template.defaultfilters import slugify
from django.contrib.auth.models import User

# Each tag that can be assigned to each game - has a name (from Steam). There is an N:N
# relationship between tags and games.
class Tag(models.Model):
    MAX_TAG = 50

    name = models.CharField(max_length=MAX_TAG, unique=True)
    slug = models.SlugField(blank=True)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Tag, self).save(*args, **kwargs)

    def __str__(self):
        return self.name

# Each game in the database - has a name, a description (from Steam), and
# relevant category tags (from Steam), an image (Steam), release year (Steam). 
# Reviews and comments are linked to games.
class Game(models.Model): 
    MAX_NAME = 128
    MAX_DESC = 1000

    tags = models.ManyToManyField(Tag, blank=True, related_name="games") # Tags for games

    name = models.CharField(max_length=MAX_NAME, unique=True)
    description = models.TextField(max_length=MAX_DESC, blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    release_year = models.IntegerField(blank=True, null=True)
    slug = models.SlugField(unique=True)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Game, self).save(*args, **kwargs)

    def __str__(self):
        return self.name

# Each review in the database - has a maximum length of 1000, rating, and
# a timestamp for creation. Reviews are linked to both a game and a user.
class Review(models.Model):
    MAX_CONTENT = 1000

    game = models.ForeignKey(Game, on_delete=models.CASCADE) # Links review to game
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews", blank=True, null=True) # Links review to user

    content = models.TextField(max_length=MAX_CONTENT, blank=True, null=True)
    rating = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)], blank=True, null=True) # Rating on 1-5 scale
    created_at_timestamp = models.DateTimeField(auto_now_add=True, blank=True, null=True) # Timestamp of creation

    class Meta:
        verbose_name_plural = "Reviews"

    def __str__(self):
        return self.content

# Each comment in the database - has a maximum length of 1000 and
# a timestamp for creation. Comments are linked to both a game and a user.
class Comment(models.Model):
    MAX_CONTENT = 1000
    
    game = models.ForeignKey(Game, on_delete=models.CASCADE) # Links comment to game
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments", blank=True, null=True) # Links comment to user

    content = models.TextField(max_length=MAX_CONTENT, blank=True, null=True)
    created_at_timestamp = models.DateTimeField(auto_now_add=True, blank=True, null=True) # Timestamp of creation

    class Meta:
        verbose_name_plural = "Comments"

    def __str__(self):
        return self.content

# Each profile in the database, extends User model - has a profile picture
# and a bio. Each user has one profile, and reviews and comments by this 
# user can be found on their profile.
class UserProfile(models.Model):
    MAX_BIO = 1000

    user = models.OneToOneField(User, on_delete=models.CASCADE) # 1:1 relationship with User model

    picture = models.ImageField(upload_to="profile_images", blank=True)
    bio = models.TextField(max_length=MAX_BIO, blank=True)

    def __str__(self):
        return self.user.username
