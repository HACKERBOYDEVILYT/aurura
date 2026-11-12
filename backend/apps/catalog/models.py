import uuid
from django.db import models
from django.utils.translation import gettext_lazy as _

class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        abstract = True

class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(unique=True, max_length=100)
    name_bn = models.CharField(max_length=100)
    name_en = models.CharField(max_length=100)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name_en

class Genre(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(unique=True, max_length=100)
    name_bn = models.CharField(max_length=100)
    name_en = models.CharField(max_length=100)

    def __str__(self):
        return self.name_en

class CastMember(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name_bn = models.CharField(max_length=150)
    name_en = models.CharField(max_length=150)
    avatar_url = models.URLField(max_length=500, blank=True)
    bio = models.TextField(blank=True)

    def __str__(self):
        return self.name_en

class Movie(TimeStampedModel):
    CONTENT_TYPES = [
        ('movie', 'Movie'),
        ('natok', 'Bangla Natok'),
        ('telefilm', 'Telefilm'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=100, unique=True)
    type = models.CharField(max_length=20, choices=CONTENT_TYPES, default='movie')
    title_bn = models.CharField(max_length=255)
    title_en = models.CharField(max_length=255)
    tagline_bn = models.CharField(max_length=255, blank=True)
    tagline_en = models.CharField(max_length=255, blank=True)
    description_bn = models.TextField()
    description_en = models.TextField()
    poster_url = models.URLField(max_length=500)
    backdrop_url = models.URLField(max_length=500)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=8.0)
    release_year = models.PositiveIntegerField()
    duration_minutes = models.PositiveIntegerField(null=True, blank=True)
    age_rating = models.CharField(max_length=20, default='13+')
    is_bangla_hub = models.BooleanField(default=False)
    is_trending = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    star_category = models.CharField(max_length=150, blank=True)
    director = models.CharField(max_length=150, blank=True)
    genres = models.ManyToManyField(Genre, related_name='movies')
    cast = models.ManyToManyField(CastMember, through='MovieCastRole', related_name='movies')

    class Meta:
        indexes = [
            models.Index(fields=['is_trending', 'created_at']),
            models.Index(fields=['is_bangla_hub', 'rating']),
        ]

    def __str__(self):
        return self.title_en

class MovieCastRole(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    cast_member = models.ForeignKey(CastMember, on_delete=models.CASCADE)
    character_name = models.CharField(max_length=150, blank=True)

class Series(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=100, unique=True)
    title_bn = models.CharField(max_length=255)
    title_en = models.CharField(max_length=255)
    tagline_bn = models.CharField(max_length=255, blank=True)
    tagline_en = models.CharField(max_length=255, blank=True)
    description_bn = models.TextField()
    description_en = models.TextField()
    poster_url = models.URLField(max_length=500)
    backdrop_url = models.URLField(max_length=500)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=8.5)
    release_year = models.PositiveIntegerField()
    age_rating = models.CharField(max_length=20, default='16+')
    is_bangla_hub = models.BooleanField(default=False)
    total_seasons = models.PositiveIntegerField(default=1)

    def __str__(self):
        return self.title_en

class Season(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    series = models.ForeignKey(Series, related_name='seasons', on_delete=models.CASCADE)
    season_number = models.PositiveIntegerField()
    title_bn = models.CharField(max_length=150)
    title_en = models.CharField(max_length=150)

    class Meta:
        unique_together = ('series', 'season_number')

class Episode(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    season = models.ForeignKey(Season, related_name='episodes', on_delete=models.CASCADE)
    episode_number = models.PositiveIntegerField()
    title_bn = models.CharField(max_length=200)
    title_en = models.CharField(max_length=200)
    duration = models.CharField(max_length=50)
    thumbnail_url = models.URLField(max_length=500)
    description_bn = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    stream_url = models.URLField(max_length=500)

    class Meta:
        unique_together = ('season', 'episode_number')
