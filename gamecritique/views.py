from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.utils.text import slugify
from django.db.models import Q
from django.shortcuts import get_object_or_404

from datetime import datetime
import random

from gamecritique.models import Game, UserProfile
from gamecritique.models import Review, Comment
from gamecritique.forms import ReviewForm, UserForm, UserProfileForm

# Random game is chosen from database to be displayed on Index page each time opened
def index(request):
    games = Game.objects.all()
    random_game = random.choice(games)
    context_dict = {"random_game": random_game}

    response = render(request, 'gamecritique/index.html', context=context_dict)
    return response

def about(request):
    context_dict = {}

    return render(request, 'gamecritique/about.html', context=context_dict)

def search(request):
    context_dict = {}

    return render(request, 'gamecritique/search.html', context=context_dict)

# AJAX call when the search button is clicked - gives input and returns list of games containing that string 
def search_games(request):
    query = request.GET.get('q', '')

    results = Game.objects.filter(Q(slug__icontains=slugify(query)) | Q(name__icontains=query))

    return JsonResponse({'results': list(results)})

def show_game(request, game_name_slug):
    context_dict = {}

    try:
        game = Game.objects.get(slug=game_name_slug)
        reviews = Review.objects.filter(game=game).order_by('-created_at_timestamp')

        context_dict['game'] = game
        context_dict['reviews'] = reviews

    except Game.DoesNotExist:
        context_dict['game'] = None
        context_dict['reviews'] = None

    return render(request, 'gamecritique/game.html', context=context_dict)

def show_review(request, review_id):
    review = get_object_or_404(Review, id=review_id)
    comments = review.comments.all().order_by('-created_at_timestamp')

    context = {'review': review, 'comments': comments,}

    return render(request, 'gamecritique/review.html', context)

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

            if "picture" in request.FILES:
                user.profile.picture = request.FILES["picture"]
                user.profile.save()

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

@login_required
def profile(request):
    profile = request.user.profile
    user = request.user
    context = {'user': user, 'profile': profile}
    return render(request, "gamecritique/profile.html", context)

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

# AJAX call when the key has been clicked - sets has_key to True for the current user
@login_required
def collect_key(request):
    if request.method == 'POST':
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        profile.has_key = True
        profile.save()

        return JsonResponse({'status': 'success'})
    
    return JsonResponse({'status': 'error'}, status=400)

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