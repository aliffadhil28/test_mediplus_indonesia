import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Table, Button, Modal } from "flowbite-react";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function Klinik({ data }) {
    const user = usePage().props.auth.user;
    const [openModal, setOpenModal] = useState(false);
    const [values, setValues] = useState({
        name: '',
        kategori: 'rumah_sakit',
        image: null,
    });

    function handleChange(e) {
        const key = e.target.name;
        const value = e.target.type === 'file' ? e.target.files[0] : e.target.value; // Periksa tipe file

        setValues(values => ({
            ...values,
            [key]: value,
        }));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        for (const key in values) {
            formData.append(key, values[key]);
        }
        axios.post(route('admin.klinik.store'), formData)
            .then(response => {
                setOpenModal(false);
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
                router.reload();
            })
            .catch(error => {
                console.log(error);
            });
    };

    const handleDelete = (id) => {
        axios.delete(route('admin.klinik.destroy', id))
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
                router.reload();
            })
            .catch(error => {
                console.log(error);
            });
    };

    const handleDetail = (id) => {
        axios.get(route('admin.jadwal.index', id))
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Klinik
                    </h2>
                    {user.role === 'admin' && (
                        <Button color="success" onClick={() => setOpenModal(true)}>Tambah Klinik</Button>
                    )}
                </div>
            }
        >
            <Head title="Klinik" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="overflow-x-auto">
                                <Table hoverable>
                                    <Table.Head>
                                        <Table.HeadCell>Klinik Name</Table.HeadCell>
                                        <Table.HeadCell>Kategori</Table.HeadCell>
                                        <Table.HeadCell>Image</Table.HeadCell>
                                        <Table.HeadCell>
                                            <span className="sr-only">Action</span>
                                        </Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body className="divide-y">
                                        {data.map((klinik) => (
                                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={klinik.id}>
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{klinik.name}</Table.Cell>
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{klinik.kategori === 'rumah_sakit' ? 'Rumah Sakit' : klinik.kategori === 'klinik' ? 'Klinik' : 'Praktik Dokter'}</Table.Cell>
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white"><img src={klinik.image} alt="image" className="w-20 h-20 object-cover" /></Table.Cell>
                                                <Table.Cell>
                                                    <div className="flex gap-2">
                                                        {user.role === 'user' && (
                                                            <Link color="primary" href={route('admin.jadwal.index', klinik.id)}>Lihat Jadwal</Link>
                                                        )}
                                                        {user.role === 'admin' && (
                                                            <Button color="failure" onClick={() => handleDelete(klinik.id)}>Delete</Button>
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
                                <label for="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nama Klinik</label>
                                <input type="text" value={values.klinik_name} onChange={handleChange} id="name" name="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Nama Klinik" required />
                            </div>
                            <div className="mb-5">
                                <label htmlFor="kategori" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Kategori
                                </label>
                                <select
                                    id="kategori"
                                    onChange={handleChange}
                                    name="kategori"
                                    value={values.kategori} // Tambahkan value untuk sinkronisasi state
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                >
                                    <option value="" disabled>Pilih Kategori</option> {/* Pilihan placeholder */}
                                    <option value="rumah_sakit">Rumah Sakit</option>
                                    <option value="klinik">Klinik</option>
                                    <option value="praktek_dokter">Praktik Dokter</option>
                                </select>
                            </div>
                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="image_input">Upload Image</label>
                                <input name="image" onChange={handleChange} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="image_input" type="file" accept="image/*" />
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
    )
}