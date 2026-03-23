from django.contrib import admin
from gamecritique.models import Game, Review, UserProfile, Comment

class GameAdmin(admin.ModelAdmin): # Allow admin to modify games
    prepopulated_fields = {'slug': ('name',)}

class CommentInline(admin.TabularInline): # Allow admin to modify comment
    model = Comment

class ReviewAdmin(admin.ModelAdmin): # Comments appear under corresponding review in admin page
    list_display = ('content', 'game', 'user')
    inline = [CommentInline]


admin.site.register(Game, GameAdmin)
admin.site.register(Review, ReviewAdmin)
admin.site.register(UserProfile)
admin.site.register(Comment)