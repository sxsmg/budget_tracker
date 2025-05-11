from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Transaction, MonthlyBudget
from .serializers import CategorySerializer, TransactionSerializer, MonthlyBudgetSerializer, RegisterSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Q
from datetime import date
from dateutil.relativedelta import relativedelta  # 
from rest_framework.authtoken.models import Token
from rest_framework import status

class BaseOwnedModelViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class CategoryViewSet(BaseOwnedModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class StandardResultsSetPagination(PageNumberPagination):
    # optional: override defaults per view
    page_size = 11
    page_size_query_param = 'page_size'
    max_page_size = 101

class TransactionViewSet(BaseOwnedModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

    # ADD THESE:
    pagination_class = StandardResultsSetPagination
    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
    ]
    filterset_fields = {
        'date': ['exact', 'gte', 'lte'],
        'category': ['exact'],
        'amount': ['exact', 'gte', 'lte'],
    }
    ordering_fields = ['date', 'amount']
    ordering = ['-date']  # default sort

class MonthlyBudgetViewSet(BaseOwnedModelViewSet):
    queryset = MonthlyBudget.objects.all()
    serializer_class = MonthlyBudgetSerializer

class FinancialSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        income_agg = Transaction.objects.filter(
            owner=user, category__type=Category.INCOME
        ).aggregate(total=Sum('amount'))
        expense_agg = Transaction.objects.filter(
            owner=user, category__type=Category.EXPENSE
        ).aggregate(total=Sum('amount'))

        total_income = income_agg['total'] or 0
        total_expenses = expense_agg['total'] or 0
        balance = total_income - total_expenses

        return Response({
            "total_income": total_income,
            "total_expenses": total_expenses,
            "balance": balance
        })


class BudgetComparisonView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        today = date.today()

        # get this month’s budget (or None)
        budget_obj = MonthlyBudget.objects.filter(
            owner=user,
            month=today.month,
            year=today.year
        ).first()

        actual_agg = Transaction.objects.filter(
            owner=user,
            category__type=Category.EXPENSE,
            date__year=today.year,
            date__month=today.month
        ).aggregate(total=Sum('amount'))

        budget_amount = budget_obj.amount if budget_obj else 0
        actual_expenses = actual_agg['total'] or 0
        difference = budget_amount - actual_expenses

        return Response({
            "budget": budget_amount,
            "actual_expenses": actual_expenses,
            "difference": difference
        })

class SummaryTrendView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        today = date.today().replace(day=1)
        # six-month window ending this month
        start_month = today - relativedelta(months=5)

        trend = []
        for i in range(6):
            dt = start_month + relativedelta(months=i)
            label = dt.strftime("%Y-%m")
            income = Transaction.objects.filter(
                owner=user,
                category__type=Category.INCOME,
                date__year=dt.year,
                date__month=dt.month
            ).aggregate(total=Sum('amount'))['total'] or 0
            expense = Transaction.objects.filter(
                owner=user,
                category__type=Category.EXPENSE,
                date__year=dt.year,
                date__month=dt.month
            ).aggregate(total=Sum('amount'))['total'] or 0

            trend.append({
                "month": label,
                "income": income,
                "expense": expense
            })

        return Response(trend)
    

class RegisterView(APIView):
    # public endpoint
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        token = Token.objects.create(user=user)
        return Response({'token': token.key}, status=status.HTTP_201_CREATED)