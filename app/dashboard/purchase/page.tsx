"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BiPlusCircle } from "react-icons/bi";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

import toast, { Toaster } from "react-hot-toast";

import { deletePurchase, getPurchases } from "@/utils/db/Purchase";
import { purchaseColumns } from "@/data/purchaseColumns";

// create a type for the data
interface Purchase {
  id: string;
  item: string;
  supplier: string;
  quantity: number;
  price: GLfloat;
  total: GLfloat;
  place: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  date?: string;
}

const page = () => {
  const [data, setData] = useState<readonly Purchase[]>([]);
  const [salesStatus, setSalesStatus] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPurchases = async () => {
    try {
      const purchases = await getPurchases();
      if (purchases) {
        const mappedPurchases = (purchase: Purchase): Purchase => {
          return {
            ...purchase,
            date: purchase.createdAt.toString().slice(4, 16),
          };
        };

        const transformedPurchases = purchases.map(mappedPurchases);
        setSalesStatus(transformedPurchases.map((item) => item.status));
        setData(transformedPurchases);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    fetchPurchases();

    // cleanup function
    return () => {};
  }, []);

  // handle form submit
  const handleDelete = async (id: string) => {
    setLoading(true);
    // add id
    try {
      toast.promise(
        deletePurchase(id),
        {
          loading: "Deleting purchase...",
          success: "purchase deleted successfully!",
          error: "Failed to delete purchase. Please try again.",
        },
        {
          style: {
            minWidth: "250px",
          },
        }
      );
      fetchPurchases();
      setLoading(false);
    } catch (error) {
      // Handle any errors that occurred during purchase creation
      toast.error("Failed to delete purchase. Please try again.");
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 160,
      renderCell: (params: any) => {
        return (
          <>
            <div className="cellAction flex gap-3">
              <Link href={`/dashboard/purchase/edit-purchase/${params.row.id}`}>
                <div className="editButton px-3 py-1 border border-yellow-500 text-yellow-500 rounded-md border-dotted">
                  Edit
                </div>
              </Link>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleDelete(params.row.id);
                }}
              >
                <input type="hidden" name="id" value={params.row.id} />
                <button
                  type="submit"
                  disabled={loading}
                  className={`deleteButton px-3 py-1 border border-red-500 text-red-500 rounded-md border-dotted cursor-pointer ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => {
                    fetchPurchases();
                  }}
                >
                  Delete
                </button>
              </form>
            </div>
            <Toaster />
          </>
        );
      },
    },
  ];

  const statusColumn = [
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params: any) => {
        const index = data.findIndex((item) => item.id === params.row.id);
        const status = salesStatus[index];

        useEffect(() => {
          const timeoutId = setTimeout(() => {
            const nextIndex = index + 1;
            if (nextIndex < data.length) {
              setData((prevData) => {
                const newData = [...prevData];
                newData[nextIndex].status = salesStatus[nextIndex];
                return newData;
              });
            }
          }, (index + 1) * 1000);

          return () => {
            clearTimeout(timeoutId);
          };
        }, [index]);

        return (
          <div className="cellAction">
            <div
              className={`status ${status} ${
                status === "pending"
                  ? "bg-yellow-500/20 border border-yellow-300 text-yellow-600 py-[.2rem] px-[.5rem] rounded-md"
                  : "text-green-600 bg-green-500/20 border border-green-300  py-[.2rem] px-[.5rem] rounded-md"
              } `}
            >
              {status}
            </div>
          </div>
        );
      },
    },
  ];
  let columns = purchaseColumns.concat(statusColumn);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl text-slate-600 font-bold">Purchases</h1>
        <Link href="/dashboard/newPurchase">
          <Button className="text-white py-5">
            <BiPlusCircle className=" mr-2" />
            <span className="">new Purchase</span>
          </Button>
        </Link>
      </div>
      <div className="datatable mt-10">
        <DataGrid
          className="datagrid dark:text-slate-200"
          rows={data}
          columns={columns.concat(actionColumn)}
        />
      </div>
    </div>
  );
};

export default page;
