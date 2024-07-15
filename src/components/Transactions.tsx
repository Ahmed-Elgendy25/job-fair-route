/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { ArrowUpRight } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import getCustomersData from '@/api/getCustomersData';
import { Input } from './ui/input';

/* TYPES */

function Transactions({
  selectedCustomer,
  setSelectedCustomer,
}: {
  selectedCustomer: customersType[] | undefined;
  setSelectedCustomer: React.Dispatch<
    React.SetStateAction<customersType[] | undefined>
  >;
}) {
  const [customers, setCustomers] = useState<customersType[] | undefined>(
    undefined
  );

  const [search, setSearch] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<
    customersType[] | undefined
  >(undefined);

  useEffect(() => {
    async function fetchData() {
      try {
        const customersData = await getCustomersData();

        setCustomers(customersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    handleInputChange();
  }, [search]);
  function handleInputChange() {
    if (search !== '') {
      const numericValue = Number(search);
      const lowercasedSearch = search.toLowerCase();

      const filtered = customers?.filter((customer) => {
        return (
          (!isNaN(numericValue) &&
            String(customer.amount).includes(String(numericValue))) ||
          customer.name.toLowerCase().includes(lowercasedSearch)
        );
      });

      console.log(filtered);
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers); // Reset to all customers if search is empty
    }
  }

  function handleSelection(id: number) {
    if (
      selectedCustomer &&
      selectedCustomer[0] &&
      selectedCustomer[0].id === id
    ) {
      setSelectedCustomer([]);
    } else {
      const selectCustomer: customersType[] | undefined = customers?.filter(
        (customer) => customer.id === id
      );
      setSelectedCustomer(selectCustomer);
    }
  }

  return (
    <>
      {customers !== undefined ? (
        <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Transactions</CardTitle>
              <CardDescription>
                Recent transactions from your store.
              </CardDescription>
            </div>
            <div className="  w-1/2 flex gap-5 items-center ml-auto">
              <Input
                type="text" // Assuming you meant to use text instead of email
                placeholder="Search by amount or name"
                className="bg-white text-black focus-visible:ring-offset-0"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button asChild size="sm" className=" gap-1 me-2">
                <a href="#">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {search === ''
                  ? customers.map((customer) => (
                      <TableRow
                        key={customer.id}
                        onClick={() => handleSelection(customer.id)}
                        className={
                          selectedCustomer &&
                          selectedCustomer[0] &&
                          selectedCustomer[0].id === customer.id
                            ? `bg-muted/50`
                            : `bg-black`
                        }
                      >
                        <TableCell>{customer.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{customer.name}</div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            {customer.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          {customer.approved === true ? (
                            <Badge className="text-xs" variant="secondary">
                              Approved
                            </Badge>
                          ) : (
                            <Badge className="text-xs" variant="destructive">
                              Declined
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className=" md:table-cell  ">
                          {customer.date}
                        </TableCell>
                        <TableCell className="text-right">
                          ${customer.amount}
                        </TableCell>
                      </TableRow>
                    ))
                  : filteredCustomers?.map((customer) => (
                      <TableRow
                        key={customer.id}
                        onClick={() => handleSelection(customer.id)}
                      >
                        <TableCell>{customer.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{customer.name}</div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            {customer.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          {customer.approved === true ? (
                            <Badge className="text-xs" variant="secondary">
                              Approved
                            </Badge>
                          ) : (
                            <Badge className="text-xs" variant="destructive">
                              Declined
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className=" md:table-cell  ">
                          {customer.date}
                        </TableCell>
                        <TableCell className="text-right">
                          ${customer.amount}
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
}

export default Transactions;
