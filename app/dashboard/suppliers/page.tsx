"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BiPlus } from "react-icons/bi";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { supplierColumns } from "@/data/supplierColumns";
import { getSuppliers, deleteSupplier } from "@/utils/db/Suppliers";

import { revalidatePath } from "next/cache";

// create a type for the data
interface Supplier {
  id: string;
  name: string;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const page = () => {
  const [data, setData] = useState<readonly Supplier[]>([]);
  const fetchSuppliers = async () => {
    try {
      const suppliers = await getSuppliers();
      if (suppliers) {
        const mappedSuppliers = (supplier: Supplier): Supplier => {
          return {
            id: supplier.id,
            name: supplier.name,
            phone: supplier.phone,
            createdAt: supplier.createdAt,
            updatedAt: supplier.updatedAt,
          };
        };

        const transformedSuppliers = suppliers.map(mappedSuppliers);
        setData(transformedSuppliers);
      }
    } catch (error) {
      console.error("Error fetching Suppliers:", error);
    }
  };
  useEffect(() => {
    fetchSuppliers();

    // cleanup function
    return () => {};
  }, []);

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 230,
      renderCell: (params: any) => {
        return (
          <div className="cellAction flex gap-3">
            <Link href={`/dashboard/suppliers/edit-supplier/${params.row.id}`}>
              <div className="editButton px-3 py-1 border border-yellow-500 text-yellow-500 rounded-md border-dotted">
                Edit
              </div>
            </Link>

            <form action={deleteSupplier}>
              <input type="hidden" name="id" value={params.row.id} />
              <button
                type="submit"
                className="deleteButton px-3 py-1 border border-red-500 text-red-500 rounded-md border-dotted cursor-pointer"
                onClick={() => {
                  fetchSuppliers();
                }}
              >
                Delete
              </button>
            </form>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl text-slate-600 font-bold">Suppliers</h1>
        <Link href="/dashboard/newSupplier">
          <Button className="text-white">
            <BiPlus className="text-lg mr-2" />
            <span className="">Add new Supplier</span>
          </Button>
        </Link>
      </div>
      <div className="datatable mt-10">
        <DataGrid
          className="datagrid dark:text-slate-200"
          rows={data}
          columns={supplierColumns.concat(actionColumn)}
          // pageSize={9}
          // rowsPerPageOptions={[9]}
          // checkboxSelection
        />
      </div>
    </div>
  );
};

export default page;
