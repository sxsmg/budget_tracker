from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, TransactionViewSet, MonthlyBudgetViewSet


from .views import (
    CategoryViewSet,
    TransactionViewSet,
    MonthlyBudgetViewSet,
    FinancialSummaryView,
    BudgetComparisonView,
    SummaryTrendView,
)

router = DefaultRouter()

router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'budgets', MonthlyBudgetViewSet, basename='budget')

urlpatterns = [
    path('', include(router.urls)),
    path('summary/', FinancialSummaryView.as_view(), name='financial-summary'),
    path('summary-trend/', SummaryTrendView.as_view(), name='summary-trend'),
    path('budget-comparison/', BudgetComparisonView.as_view(), name='budget-comparison'),
]