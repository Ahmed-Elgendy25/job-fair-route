import { TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  // CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useEffect, useState } from 'react';
import getCustomersData from '@/api/getCustomersData';

const chartConfig = {
  amount: {
    label: 'amount',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
  return new Intl.DateTimeFormat('en-GB', options).format(date);
}

function ChartComponent({
  selectedCustomer,
}: {
  selectedCustomer: customersType[] | undefined;
}) {
  const [customers, setCustomers] = useState<customersType[] | undefined>(
    undefined
  );

  const [transactionGraph, setTransactionGraph] = useState<
    { id: number; month: string; amount: number }[]
  >([]);

  useEffect(() => {
    if (selectedCustomer && selectedCustomer.length > 0) {
      const { date, amount, id } = selectedCustomer[0];
      setTransactionGraph([{ id, month: formatDate(date), amount: amount }]);
    } else {
      const graph = customers?.map((customer) => {
        return {
          id: customer.id,
          month: formatDate(customer.date),
          amount: customer.amount,
        };
      });
      setTransactionGraph(graph || []);
    }
  }, [selectedCustomer]);

  useEffect(() => {
    async function fetchData() {
      try {
        const customerData: customersType[] = await getCustomersData();
        setCustomers(customerData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      {customers ? (
        <Card>
          <CardHeader>
            <CardTitle>Total Transactions per day</CardTitle>
            {/* <CardDescription>January - June 2024</CardDescription> */}
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} key={transactionGraph[0].id}>
              <LineChart
                accessibilityLayer
                data={transactionGraph ? transactionGraph : []}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={true} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  dataKey="amount"
                  type="linear"
                  stroke="var(--color-amount)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>
      ) : null}
    </>
  );
}

export default ChartComponent;
