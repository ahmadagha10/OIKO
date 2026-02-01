'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DollarSign, Package, Users, ShoppingBag, ArrowRight } from "lucide-react";
import { StatsCard } from "@/components/admin/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAdminOrders, getSalesAnalytics } from "@/lib/api";
import { TableSkeleton } from "@/components/admin/loading-skeleton";
import { toast } from "sonner";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  revenueChange?: number;
  ordersChange?: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [ordersResponse, analyticsResponse] = await Promise.all([
        getAdminOrders({ limit: 10, sortBy: 'createdAt', sortOrder: 'desc' }),
        getSalesAnalytics({ period: '30days' }),
      ]);

      if (ordersResponse.success) {
        setRecentOrders(ordersResponse.data || []);
      }

      if (analyticsResponse.success) {
        const data = analyticsResponse.data;
        setStats({
          totalRevenue: data?.totalRevenue || 0,
          totalOrders: data?.totalOrders || 0,
          totalUsers: data?.totalCustomers || 0,
          totalProducts: data?.totalProducts || 0,
          revenueChange: data?.revenueChange,
          ordersChange: data?.ordersChange,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your store's performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          change={stats.revenueChange}
          trend={stats.revenueChange && stats.revenueChange > 0 ? 'up' : 'down'}
          icon={DollarSign}
          description="from last month"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          change={stats.ordersChange}
          trend={stats.ordersChange && stats.ordersChange > 0 ? 'up' : 'down'}
          icon={Package}
          description="from last month"
        />
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          description="registered customers"
        />
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon={ShoppingBag}
          description="in catalog"
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/admin/orders')}
          >
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <TableSkeleton />
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No orders yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Ref</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow
                    key={order._id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/admin/orders?id=${order._id}`)}
                  >
                    <TableCell className="font-medium">{order.orderRef}</TableCell>
                    <TableCell>
                      {order.customerInfo?.firstName} {order.customerInfo?.lastName}
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>{order.items?.length || 0}</TableCell>
                    <TableCell>{formatCurrency(order.total)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)} variant="secondary">
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
