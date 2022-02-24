from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib import messages, auth
from django.contrib.auth.decorators import login_required


def register(request):
    if request.method == 'POST':
        # GET FORM VALUES
        name = request.POST['first_name']
        email = request.POST['email']
        username = request.POST['username']
        password = request.POST['password']
        password2 = request.POST['password2']

        # CHECK IF PASSWORD MATCH

        if password == password2:
            # CHECK EMAIL
            if User.objects.filter(email=email).exists():
                messages.error(request, 'Email already exists.')
                return redirect('accounts:register')
            # CHECK USERNAME
            if User.objects.filter(username=username).exists():
                messages.error(request, 'Username already exists.')
                return redirect('accounts:register')
            else:
                # EVERYTHING GOOD THEN...
                user = User.objects.create_user(username=username, first_name=name, email=email, password=password)
                user.save()
                messages.success(request, 'You are registered, and can log in.')
                return redirect('http://localhost:3000')

        else:
            messages.error(request, 'Password not matched')
            return redirect('accounts:register')
    else:
        return render(request, 'accounts/register.html')


def login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        try:
            user = auth.authenticate(username=User.objects.get(email=username), password=password)

        except:
            user = auth.authenticate(username=username, password=password)

        if user is not None:
            auth.login(request, user)
            messages.success(request, "You are now logged in.")
            return redirect('todo:tasks')
        else:
            messages.error(request, 'Invalid credentials.')
            return redirect('http://localhost:3000')
    else:
        return redirect('http://localhost:3000')


@login_required()
def logout(request):
    auth.logout(request)
    return redirect('todo:index')

