from django.urls import path
from gamecritique import views

app_name = "gamecritique"

urlpatterns = [
    path("", views.index, name="index"),
    path("about/", views.about, name="about"),
    path("game/<slug:game_name_slug>/", views.show_game, name="show_game"),
    path("review/<int:review_id>/", views.show_review, name="show_review"),
    path("game/<slug:game_name_slug>/add_review/", views.add_review, name="add_review"),
    path("register/", views.register, name="register"),
    path("login/", views.user_login, name="login"),
    path("restricted/", views.restricted, name="restricted"),
    path("logout/", views.user_logout, name="logout"),
    path("gamepage", views.gamepage, name="gamepage"),
    path("profile", views.profile, name="profile"),
    path("collect-key/", views.collect_key, name='collect_key'), # AJAX path for updating database without reloading page
]