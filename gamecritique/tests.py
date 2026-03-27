from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from gamecritique.models import Game, Tag, Review, Comment


class Tests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username="bob", password="password123")
        self.profile = self.user.profile
        self.tag = Tag.objects.create(name="Multiplayer")
        self.game1 = Game.objects.create(name="Portal 2", slug="portal-2")
        self.game1.tags.add(self.tag)
        self.game2 = Game.objects.create(name="Minecraft", slug="minecraft")
        self.review = Review.objects.create(game=self.game1, user=self.user, content="Awesome!")

    def testSearchByName(self):
        response = self.client.get(reverse("gamecritique:search_games"),{"query": "Portal"})
        data = response.json()
        names = [g["name"] for g in data]
        self.assertIn("Portal 2", names)
        self.assertNotIn("Minecraft", names)

    def testSearchByTag(self):
        response = self.client.get(reverse("gamecritique:search_games"),{"query": "Multiplayer"})
        data = response.json()
        names = [g["name"] for g in data]
        self.assertIn("Portal 2", names)
        self.assertNotIn("Minecraft", names)

    def testGameURLLoadsGame(self):
        response = self.client.get(reverse("gamecritique:show_game", args=[self.game1.slug]))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Portal 2")

    def testKeyRequiredForGame(self):
        self.client.login(username="bob", password="password123")
        response = self.client.get(reverse("gamecritique:profile"))
        self.assertNotContains(response, "What's this?")
        self.profile.has_key = True
        self.profile.save()
        response = self.client.get(reverse("gamecritique:profile"))
        self.assertContains(response, "What's this?")

    def testLoggedInUserCanComment(self):
        self.client.login(username="bob", password="password123")
        response = self.client.post(reverse("gamecritique:add_comment", args=[self.review.id]),{"content": "Cool review!"})
        self.assertEqual(Comment.objects.count(), 1)
        self.assertRedirects(response,reverse("gamecritique:show_review", args=[self.review.id]))

    def testLoggedInUserCanReview(self):
        self.client.login(username="bob", password="password123")
        response = self.client.post(reverse("gamecritique:add_review", args=[self.game1.slug]),{"content": "I love this game!", "rating": 5})
        self.assertEqual(Review.objects.count(), 2)
        self.assertRedirects(response,reverse("gamecritique:show_game", args=[self.game1.slug]))