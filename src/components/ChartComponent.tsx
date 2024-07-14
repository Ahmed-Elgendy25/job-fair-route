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

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
  return new Intl.DateTimeFormat('en-GB', options).format(date);
}

const chartConfig = {
  amount: {
    label: 'amount',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

function ChartComponent() {
  const [customers, setCustomers] = useState<customersType[] | undefined>(
    undefined
  );

  let transactionGraph: { month: string; amount: number }[] = [];
  if (customers) {
    transactionGraph = customers.map((customer) => {
      return {
        month: customer.date,
        amount: customer.amount,
      };
    });

    transactionGraph.forEach(
      (transaction: { month: string; amount: number }) =>
        (transaction.month = formatDate(transaction.month))
    );

    console.log(transactionGraph);
  }
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
    <Card>
      <CardHeader>
        <CardTitle>Total Transactions per day</CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
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
  );
}

export default ChartComponent;
