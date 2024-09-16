from django.shortcuts import render
from django.http import JsonResponse
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
from rest_framework.decorators import api_view, permission_classes

from userauths.models import User, Profile
from userauths.serializers import MyTokenObtainPairSerializer, ProfileSerializer, RegisterSerializer, UserSerializer

import random
import shortuuid
import json

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

# class PasswordResetEmailVerify(generics.RetrieveAPIView):
#     permission_classes = (AllowAny, )
#     serializer_class = UserSerializer

#     def get_object(self):
#         email = self.kwargs['email']
#         user = User.objects.get(email=email)

        
#         if user:
#             user.otp = generate_otp()
#             user.save()

#             uidb64 = user.pk
#             otp = user.otp

#             # link = f"http://127.0.0.1:8000/create-new-password?otp={otp}&uidb64={uidb64}"
#             link = f"http://localhost:5173/create-new-password?otp={otp}&uidb64={uidb64}"
#             print("------PasswordResetEmailVerify--------link---Otp", link)

#             # Send Email

            
#         return user

class PasswordResetEmailVerify(generics.RetrieveAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer
    
    def get_object(self):
        email = self.kwargs['email']
        user = User.objects.get(email=email)
        
        if user:
            user.otp = generate_otp()
            uidb64 = user.pk
            
             # Generate a token and include it in the reset link sent via email
            refresh = RefreshToken.for_user(user)
            reset_token = str(refresh.access_token)

            # Store the reset_token in the user model for later verification
            user.reset_token = reset_token
            user.save()

            link = f"http://localhost:5173/create-new-password?otp={user.otp}&uidb64={uidb64}&reset_token={reset_token}"
            
            merge_data = {
                'link': link, 
                'username': user.username, 
                # 'full_name': user.full_name, 
            }
            subject = f"Password Reset Request"
            text_body = render_to_string("email/password_reset.txt", merge_data)
            html_body = render_to_string("email/password_reset.html", merge_data)
            
            msg = EmailMultiAlternatives(
                subject=subject, from_email=settings.FROM_EMAIL,
                to=[user.email], body=text_body
            )
            msg.attach_alternative(html_body, "text/html")
            msg.send()
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

        # print("otp ======", otp)
        # print("uidb64 ======", uidb64)
        # # print("reset_token ======", reset_token)
        # print("password ======", password)

        user = User.objects.get(id=uidb64, otp=otp)
        if user:
            user.set_password(password)
            user.otp = ""
            user.reset_token = ""
            user.save()

            return Response( {"message": "Password Changed Successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response( {"message": "An Error Occured"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permession_classes = [AllowAny]
    
    def get_object(self):
        user_id = self.kwargs['user_id']

        user = User.objects.get(id=user_id)
        profile = Profile.objects.get(user=user)
        return profile
