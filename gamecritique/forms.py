from django import forms
from django.contrib.auth.models import User
from gamecritique.models import Review, UserProfile, Comment

class ReviewForm(forms.ModelForm):
    RATING_CHOICES = [
        (5, "5"),
        (4, "4"),
        (3, "3"),
        (2, "2"),
        (1, "1")
    ]

    content = forms.CharField(
        widget=forms.Textarea(attrs = {
            "placeholder": "Write your review here...",
            'class': 'text-input',
            'id': 'review-text'
        })
    )
    rating = forms.TypedChoiceField(
        choices=RATING_CHOICES,
        coerce=int,
        widget=forms.RadioSelect
    )

    class Meta:
        model = Review
        fields = ("content", "rating")

class CommentForm(forms.ModelForm):
    content = forms.CharField(
        widget=forms.Textarea(attrs={
            "placeholder": "Write a comment here...",
            'class': 'text-input',
            'id': 'comment-text'
        })
    )

    class Meta:
        model = Comment
        fields = ("content",)
    
class UserForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())

    class Meta:
        model = User
        fields = ("username", "email", "password",)

class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ("picture",)