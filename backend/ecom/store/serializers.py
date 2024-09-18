from rest_framework import serializers
from userauths.serializers import ProfileSerializer
from vendor.models import Vendor

from store.models import (
    Product,
    Category,
    Gallary,
    Specification,
    Size,
    Color,
    Cart,
    CartOrder,
    CartOrderItem,
    ProductFaq,
    Review,
    Coupon,
    Notification,
    Wishlist,
)


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = "__all__"


class GallarySerializer(serializers.ModelSerializer):

    class Meta:
        model = Gallary
        fields = "__all__"


class SpecificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Specification
        fields = "__all__"


class SizeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Size
        fields = "__all__"


class ColorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Color
        fields = "__all__"


# class ProductSerializer(serializers.ModelSerializer):
#     gallary = GallarySerializer(many=True, read_only=True)
#     color = ColorSerializer(many=True, read_only=True)
#     specification = SpecificationSerializer(many=True, read_only=True)
#     size = SizeSerializer(many=True, read_only=True)

#     class Meta:
#         model = Product
#         fields = [
#             "id",
#             "title",
#             "image",
#             "description",
#             "category",
#             "price",
#             "old_price",
#             "shipping_amount",
#             "stock_qty",
#             "in_stock",
#             "status",
#             "featured",
#             "views",
#             "rating",
#             "vendor",
#             "gallary",
#             "color",
#             "specification",
#             "size",
#             "product_rating",  # from def product_rating
#             "rating_count",  # from def rating_count
#             "pid",
#             "slug",
#             "date",
#         ]

#     def __init__(self, *args, **kwargs):
#         super(ProductSerializer, self).__init__(*args, **kwargs)
#         # Customize serialization depth based on the request method.
#         request = self.context.get("request")
#         if request and request.method == "POST":
#             # When creating a new product, set serialization depth to 0.
#             self.Meta.depth = 0
#         else:
#             # For other methods, set serialization depth to 3.
#             self.Meta.depth = 3

class ProductSerializer(serializers.ModelSerializer):
    # Assuming these are related models and `many=True` indicates a many-to-many or one-to-many relationship
    gallary = GallarySerializer(many=True, read_only=True)
    color = ColorSerializer(many=True, read_only=True)
    specification = SpecificationSerializer(many=True, read_only=True)
    size = SizeSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "title",
            "image",
            "description",
            "category",
            "price",
            "old_price",
            "shipping_amount",
            "stock_qty",
            "in_stock",
            "status",
            "featured",
            "views",
            "rating",
            "vendor",
            "gallary",
            "color",
            "specification",
            "size",
            "product_rating",  # from def product_rating
            "rating_count",  # from def rating_count
            "pid",
            "slug",
            "date",
        ]

    def __init__(self, *args, **kwargs):
        super(ProductSerializer, self).__init__(*args, **kwargs)
        # Customize serialization depth based on the request method.
        request = self.context.get("request")
        if request and request.method == "POST":
            # When creating a new product, set serialization depth to 0.
            self.Meta.depth = 0
        else:
            # For other methods, set serialization depth to 3.
            self.Meta.depth = 3

    # Add this method if you need to handle nested serializers dynamically
    def to_representation(self, instance):
        representation = super(ProductSerializer, self).to_representation(instance)

        # Check if the slug field exists in the related objects
        if 'slug' not in representation:
            representation['slug'] = instance.slug if hasattr(instance, 'slug') else None

        return representation



class CartSerializer(serializers.ModelSerializer):
    # product = ProductSerializer()
    class Meta:
        model = Cart
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(CartSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3


class CartOrderItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = CartOrderItem
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(CartOrderItemSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3


class CartOrderSerializer(serializers.ModelSerializer):
    orderitem = CartOrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = CartOrder
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(CartOrderSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3


class ProductFaqSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductFaq
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(ProductFaqSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3


class ReviewSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    class Meta:
        model = Review
        fields = ["id", "review", "rating", "user", "profile", "date"]

    def __init__(self, *args, **kwargs):
        super(ReviewSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3


class WishlistSerializer(serializers.ModelSerializer):

    class Meta:
        model = Wishlist
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(WishlistSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3


class CouponSerializer(serializers.ModelSerializer):

    class Meta:
        model = Coupon
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(CouponSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3


class NotificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Notification
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(NotificationSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3


# Vendor app's Vendor model
class VendorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vendor
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(VendorSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3


class SummarySerializer(serializers.Serializer):
    products = serializers.IntegerField()
    orders = serializers.IntegerField()
    revenue = serializers.DecimalField(max_digits=12, decimal_places=2)