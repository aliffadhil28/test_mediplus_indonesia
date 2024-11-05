import { Head, Link, usePage } from "@inertiajs/react";
import axios from "axios";
import { useState } from "react";
import { Table, Button, Modal } from "flowbite-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Swal from 'sweetalert2';

export default function Jadwal({ klinik, jadwal }) {
    const user = usePage().props.auth.user;
    const [openModal, setOpenModal] = useState(false);
    const [values, setValues] = useState({
        klinik_id: klinik.id,
        tanggal: "",
        quota: "",
        harga: "",
    });

    function handleChange(e) {
        const key = e.target.name;
        const value = e.target.type === "file" ? e.target.files[0] : e.target.value;
        setValues({ ...values, [key]: value });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(values);

        axios.post(route('admin.jadwal.store'), values)
            .then(response => {
                if (response.data.success) {
                    setOpenModal(false);
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: response.data.message
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.data.message
                    });
                }
                window.location.reload();
            })
            .catch(error => {
                console.log(error);
            });
    };

    const handleBooking = (id) => {
        axios.post(route('admin.jadwal.booking', id))
            .then(response => {
                console.log(response);
                if (response.data.success) {

                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: response.data.message
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.data.message
                    });
                }
                window.location.reload();
            })
            .catch(error => {
                console.log(error);
            });
    };

    const handleDelete = (id) => {
        axios.delete(route('admin.jadwal.destroy', id))
            .then(response => {
                if (response.data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: response.data.message
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.data.message
                    });
                }
                window.location.reload();
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Jadwal klinik {klinik.name}
                    </h2>

                    {user.role === 'admin' && (
                        <Button color="success" onClick={() => setOpenModal(true)}>Tambah Jadwal</Button>
                    )}
                </div>
            }
        >
            <Head title="Jadwal" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="overflow-x-auto">
                                <Table hoverable>
                                    <Table.Head>
                                        <Table.HeadCell>Tanggal</Table.HeadCell>
                                        <Table.HeadCell>Quota</Table.HeadCell>
                                        <Table.HeadCell>Harga</Table.HeadCell>
                                        <Table.HeadCell>
                                            <span className="sr-only">Action</span>
                                        </Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body className="divide-y">
                                        {jadwal.map((data) => (
                                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={data.id}>
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{data.tanggal}</Table.Cell>
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{data.quota}</Table.Cell>
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{data.harga}</Table.Cell>
                                                <Table.Cell>
                                                    <div className="flex gap-2">
                                                        {user.role === 'user' && (
                                                            <Button color="success" onClick={() => handleBooking(data.id)}>Booking</Button>
                                                        )}
                                                        {user.role === 'admin' && (
                                                            <Button color="failure" onClick={() => handleDelete(data.id)}>Delete</Button>
                                                        )}
                                                    </div>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>Tambah Data</Modal.Header>
                <form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <div className="space-y-6">
                            <div className="mb-5">
                                <label htmlFor="tanggal" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tanggal</label>
                                <input
                                    type="date"
                                    value={values.tanggal}
                                    onChange={handleChange}
                                    id="tanggal"
                                    name="tanggal"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Tanggal"
                                    required
                                />
                            </div>
                            <div className="mb-5">
                                <label htmlFor="quota" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Limit Maksimal</label>
                                <input
                                    type="number"
                                    value={values.quota}
                                    onChange={handleChange}
                                    id="quota"
                                    name="quota"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Limit"
                                    required
                                />
                            </div>
                            <div className="mb-5">
                                <label htmlFor="harga" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Harga</label>
                                <input
                                    type="number"
                                    value={values.harga}
                                    onChange={handleChange}
                                    id="harga"
                                    name="harga"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Harga"
                                    required
                                />
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit">Submit</Button>
                        <Button color="gray" onClick={() => setOpenModal(false)}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
