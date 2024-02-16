from django.shortcuts import render

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny

from userauths.models import User, Profile
from userauths.serializers import MyTokenObtainPairSerializer, RegisterSerializer, UserSerializer

import random
import shortuuid

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny, )
    serializer_class = RegisterSerializer


def generate_otp():
    uuid_key = shortuuid.uuid() # generates charecters random
    unique_key = uuid_key[:6] # grabs only first 6 of the char
    return unique_key

class PasswordResetEmailVerify(generics.RetrieveAPIView):
    permission_classes = (AllowAny, )
    serializer_class = UserSerializer

    def get_object(self):
        email = self.kwargs['email']
        user = User.objects.get(email=email)

        
        if user:
            user.otp = generate_otp()
            user.save()

            uidb64 = user.pk
            otp = user.otp

            link = f"http://127.0.0.1:8000/create-new-password?otp={otp}&uidb64={uidb64}"
            print("------PasswordResetEmailVerify--------link---Otp", link)

            # Send Email

            
        return user