from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import redirect
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from datetime import datetime

from gamecritique.models import Game
from gamecritique.models import Review
from gamecritique.forms import ReviewForm, UserForm, UserProfileForm

def index(request):
    context_dict = {}

    response = render(request, 'gamecritique/index.html', context=context_dict)
    return response

def about(request):

    context_dict = {}

    return render(request, 'gamecritique/about.html', context=context_dict)

def show_game(request, game_name_slug):
    context_dict = {}

    try:
        game = Game.objects.get(slug=game_name_slug)
        reviews = Review.objects.filter(game=game)

        context_dict['game'] = game
        context_dict['reviews'] = reviews

    except Game.DoesNotExist:
        context_dict['game'] = None
        context_dict['reviews'] = None

    return render(request, 'gamecritique/game.html', context=context_dict)

@login_required
def add_review(request, game_name_slug):
    try:
        game = Game.objects.get(slug=game_name_slug)
    except Game.DoesNotExist:
        game = None

    if game is None:
        return redirect(reverse("gamecritique:index"))

    form = ReviewForm()

    if request.method == 'POST':
        form = ReviewForm(request.POST)

        if form.is_valid():
            if game:
                review = form.save(commit=False)
                review.game = game
                review.views = 0
                review.save()

                return redirect(reverse('gamecritique:show_game', kwargs={'game_name_slug': game_name_slug}))
        else:
            print(form.errors)

    context_dict = {'form': form, 'game': game}
    return render(request, 'gamecritique/add_review.html', context=context_dict)

def register(request):
    registered = False

    if request.method == "POST":
        user_form = UserForm(request.POST)
        profile_form = UserProfileForm(request.POST)

        if user_form.is_valid() and profile_form.is_valid():
            user = user_form.save()

            user.set_password(user.password)
            user.save()

            profile = profile_form.save(commit=False)
            profile.user = user
            if "picture" in request.FILES:
                profile.picture = request.FILES["picture"]

            profile.save()

            registered = True
        else:
            print(user_form.errors, profile_form.errors)
    else:
        user_form = UserForm()
        profile_form = UserProfileForm()

    return render(request, "gamecritique/register.html", 
                  context = {"user_form": user_form,
                             "profile_form": profile_form,
                             "registered": registered})

def profile(request):
    return render(request, "gamecritique/profile.html")

def user_login(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(username=username, password=password)

        if user:
            if user.is_active:
                login(request, user)
                return redirect(reverse("gamecritique:index"))
            else:
                return HttpResponse("Account disabled")
        else:
            print(f"Invalid login details: {username}, {password}")
            return HttpResponse("Invalid login details supplied")
    else:
        return render(request, "gamecritique/login.html")
    
@login_required
def restricted(request):
    return render(request, "gamecritique/restricted.html")

@login_required
def user_logout(request):
    logout(request)

    return redirect(reverse("gamecritique:index"))

def gamepage(request):
    return render(request, "gamecritique/gamepage.html")


def get_server_side_cookie(request, cookie, default_val=None):
    val = request.session.get(cookie)

    if not val:
        val = default_val

    return val

# We'll change this to track something other than visits at some point
def visitor_cookie_handler(request):
    visits = int(get_server_side_cookie(request, "visits", "1"))

    last_visit_cookie = get_server_side_cookie(request, "last_visit", str(datetime.now()))
    last_visit_time = datetime.strptime(last_visit_cookie[:-7], "%Y-%m-%d %H:%M:%S")

    if (datetime.now() - last_visit_time).days > 0:
        visits += 1
        request.session["last_visit"] = str(datetime.now())
    else:
        request.session["last_visit"] = last_visit_cookie

    request.session["visits"] = visits