import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Edit2, MoreHorizontal, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';

const CompaniesTable = () => {
  const { companies, searchCompanyByText } = useSelector(store => store.company);
  const [filterCompany, setFilterCompany] = useState(companies);
  const navigate = useNavigate();

  useEffect(() => {
    const filteredCompany = companies.length >= 0 && companies.filter((company) => {
      if (!searchCompanyByText) {
        return true;
      }
      return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
    });
    setFilterCompany(filteredCompany);
  }, [companies, searchCompanyByText]);

  const deleteCompany = async (companyId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this company!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${COMPANY_API_END_POINT}/delete/${companyId}`, { withCredentials: true });
          toast.success('Company Deleted Successfully');
          
          // Update state instead of reloading the whole page
          setFilterCompany((prev) => prev.filter((company) => company._id !== companyId));
  
        } catch (error) {
          toast.error('Failed to delete company');
        }
      }
    });
  };
  

  return (
    <div>
      <Table>
        <TableCaption>A list of your recent registered companies</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterCompany?.map((company) => (
            <TableRow key={company._id}>
              <TableCell>
                <Avatar>
                  <AvatarImage src={company.logo} />
                </Avatar>
              </TableCell>
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.createdAt.split("T")[0]}</TableCell>
              <TableCell className="text-right cursor-pointer">
                <Popover>
                  <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                  <PopoverContent className="w-32">
                    <div onClick={() => navigate(`/admin/companies/${company._id}`)} className='flex items-center gap-2 w-fit cursor-pointer'>
                      <Edit2 className='w-4' />
                      <span>Edit</span>
                    </div>
                    <div onClick={() => deleteCompany(company._id)} className="flex items-center gap-2 w-fit cursor-pointer text-red-500 mt-2">
                      <Trash2 className='w-4' />
                      <span>Delete</span>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompaniesTable;
