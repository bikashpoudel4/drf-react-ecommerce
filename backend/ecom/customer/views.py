from django.shortcuts import render, redirect
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from decimal import Decimal

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from userauths.models import User
from store.serializers import (
    ProductSerializer,
    CategorySerializer,
    CartSerializer,
    CartOrderSerializer,
    CartOrderItemSerializer,
    CouponSerializer,
    NotificationSerializer,
    ReviewSerializer,
)
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
    Tax,
)
import stripe
import requests

class OrdersAPIView(generics.ListAPIView):
    serializer_class = CartOrderItemSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = User.objects.get(id=user_id)

        orders = CartOrder.objects.filter(buyer=user, payment_status="paid")
        return orders
    
class OrderDetailAPIView(generics.RetrieveAPIView):
    serializer_class = CartOrderSerializer
    permession_classes = [AllowAny]

    def get_object(self):
        user_id = self.kwargs['user_id']
        order_oid = self.kwargs['order_oid']

        user = User.objects.get(id=user_id)

        order = CartOrder.objects.get(buyer=user, oid=order_oid, payment_status="paid")
        return order