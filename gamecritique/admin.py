from django.contrib import admin
from gamecritique.models import Game, Review, UserProfile

class GameAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}

class ReviewAdmin(admin.ModelAdmin):
    list_display = ('text', 'game')

admin.site.register(Game, GameAdmin)
admin.site.register(Review, ReviewAdmin)
admin.site.register(UserProfile)
