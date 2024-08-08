from django.shortcuts import render

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework.response import Response

from userauths.models import User, Profile
from userauths.serializers import MyTokenObtainPairSerializer, ProfileSerializer, RegisterSerializer, UserSerializer

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

            # link = f"http://127.0.0.1:8000/create-new-password?otp={otp}&uidb64={uidb64}"
            link = f"http://localhost:5173/create-new-password?otp={otp}&uidb64={uidb64}"
            print("------PasswordResetEmailVerify--------link---Otp", link)

            # Send Email

            
        return user

class PasswordChangeView(generics.CreateAPIView):
    permission_classes = (AllowAny, )
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        payload = request.data

        otp = payload['otp']
        uidb64 = payload['uidb64']
        # reset_token = payload['reset_token']
        password = payload['password']

        print("otp ======", otp)
        print("uidb64 ======", uidb64)
        # print("reset_token ======", reset_token)
        print("password ======", password)

        user = User.objects.get(id=uidb64, otp=otp)
        if user:
            user.set_password(password)
            user.otp = ""
            user.reset_token = ""
            user.save()

            return Response( {"message": "Password Changed Successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response( {"message": "An Error Occured"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class ProfileView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permession_classes = [AllowAny]
    
    def get_object(self):
        user_id = self.kwargs['user_id']

        user = User.objects.get(id=user_id)
        profile = Profile.objects.get(user=user)
        return profile
