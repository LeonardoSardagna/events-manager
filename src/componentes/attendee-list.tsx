import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CircleCheck, CircleX, Edit, Mail, MoreHorizontal, Search, Trash2, User, UserPlus } from "lucide-react";
import { IconButton } from "./icon-button";
import { Table } from "./table/table";
import { TableHeader } from "./table/table-header";
import { TableCell } from "./table/table-cell";
import { ChangeEvent, useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/pt-br'
import { AddParticipants } from "./addparticipants";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Dropdown, DropdownMenu, DropdownItem, cn } from "@nextui-org/react";

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

interface Attendees {
    id: string
    name: string
    email: string
    checkedInAt: string
    createdAt: string
}

export function AttendeeList() {
    const [search, setSearch] = useState(() => {
        const url = new URL(window.location.toString())
        if (url.searchParams.has('search')) {
            return url.searchParams.get('search') ?? ''
        }
        return ''
    })

    const [page, setPage] = useState(() => {
        const url = new URL(window.location.toString())
        if (url.searchParams.has('page')) {
            return Number(url.searchParams.get('page'))
        }
        return 1
    })

    const [total, setTotal] = useState(0)
    const [attendees, setAttendees] = useState<Attendees[]>([])
    const totalpages = Math.ceil(total / 10)

    useEffect(() => {
        const url = new URL('http://localhost:3333/events/12d1dd79-48ed-4656-9ce5-61828fc7cb86/attendees')
        url.searchParams.set('pageIndex', String(page - 1))
        if (search.length > 0) {
            url.searchParams.set('query', search)
        }

        fetch(url)
            .then(response => response.json())
            .then(date => {
                setAttendees(date.attendees)
                setTotal(date.total)
            })
    }, [page, search])

    function setCurrentSearch(search: string) {
        const url = new URL(window.location.toString())
        url.searchParams.set('search', search)
        window.history.pushState({}, "", url)
        setSearch(search)
    }

    function setCurrentPage(page: number) {
        const url = new URL(window.location.toString())
        url.searchParams.set('page', String(page))
        window.history.pushState({}, "", url)
        setPage(page)
    }

    function onChangedSearchEntry(event: ChangeEvent<HTMLInputElement>) {
        setCurrentSearch(event.target.value)
        setCurrentPage(1)
    }

    function goToFirst() {
        setCurrentPage(1)
    }

    function goToPrevious() {
        setCurrentPage(page - 1)
    }

    function goToNextPag() {
        setCurrentPage(page + 1)
    }

    function goLastPage() {
        setCurrentPage(totalpages)
    }

    //adiciona o menu no lado do usuário
    const [menuAberto, setMenuAberto] = useState<number | null>(null);

    const toggleMenu = (index: number) => {
        setMenuAberto(menuAberto === index ? null : index)
    }

    //adiciona o menu para adicionar um usuário
    const [addAttendee, setAddAttendee] = useState(false)

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

    return (
        <div className="flex flex-col gap-5">
            <p className="text-base font-normal text-zinc-300">Lista de participantes para o evento <strong>Unite Summit 2024</strong></p>
            <div className="flex items-center gap-3 ">
                <h1 className="text-2xl font-bold " >Participantes</h1>
                <div className="w-72 flex items-center border border-white/20 rounded-lg px-3 py-1.5 gap-2">
                    <Search className="size-4 text-orange-300" />
                    <input
                        onChange={onChangedSearchEntry}
                        value={search}
                        className=" flex-1 bg-transparent p-0 border-0 focus:ring-0"
                        placeholder="Buscar participante..."
                        type="text" />
                </div>
                <div >
                    <Button onPress={onOpen} className="border border-zinc-500 bg-transparent transition ease-in-out hover:scale-105">
                        <div className="flex gap-2 items-center">
                            <UserPlus className="text-green-700 " />
                            <p className="text-zinc-50">Adicionar participante</p>
                        </div>
                    </Button>
                    <Modal
                        backdrop="opaque"
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                        radius="lg"
                        classNames={{
                            body: "py-6",
                            backdrop: "bg-[#000000]/50 backdrop-opacity-40",
                            base: "border-[#292f46] bg-[#27272a] dark:bg-[#19172c] text-[#ffffff]",
                            header: "border-b-[1px] border-[#6b7280]",
                            footer: "border-t-[1px] border-[#6b7280]",
                            closeButton: "hover:bg-white/5 active:bg-white/10",
                        }}
                    >
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Editar</ModalHeader>
                                    <ModalBody>
                                        <Input
                                            autoFocus
                                            endContent={
                                                <User className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                            }
                                            label="Email"
                                            placeholder="Enter your email"
                                            variant="bordered"
                                        />
                                        <Input
                                            endContent={
                                                <Mail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                            }
                                            label="Password"
                                            placeholder="Enter your password"
                                            type="password"
                                            variant="bordered"
                                        />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="flat" onPress={onClose}>
                                            Fechar
                                        </Button>
                                        <Button color="primary" onPress={onClose}>
                                            Adicionar
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </div>
            </div>
            {addAttendee && (
                <>
                    <div className="absolute right-2/4 top-2/4 translate-x-2/4 -translate-y-3/4">
                        <AddParticipants />
                    </div>
                </>
            )}
            <Table>
                <thead className="border-b border-white/20">
                    <tr>
                        <TableHeader style={{ width: 32 }}>
                            <input type="checkbox" className="size-3 bg-transparent rounded border border-white/20 checked:text-orange-400 focus:ring-0" />
                        </TableHeader>
                        <TableHeader>Ingresso</TableHeader>
                        <TableHeader>Participante</TableHeader>
                        <TableHeader>Data da inscrição</TableHeader>
                        <TableHeader>Data do check-in</TableHeader>
                        <TableHeader style={{ width: 64 }}></TableHeader>
                    </tr>
                </thead>
                <tbody className="border-b border-white/20">
                    {attendees.map((attendee, index) => {
                        return (
                            <tr key={attendee.name} className=" border-b border-white/20  hover:bg-white/5">
                                <TableCell>
                                    <input type="checkbox" className=" size-3 bg-transparent rounded border border-white/20 checked:text-orange-400 focus:ring-0" />
                                </TableCell>
                                <TableCell>{attendee.id}</TableCell>
                                <td className="flex flex-col gap-1 text-sm px-4 py-4">
                                    <span className="font-semibold">{attendee.name}</span>
                                    <span className="text-zinc-300">{attendee.email}</span>
                                </td>
                                <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
                                <TableCell>{attendee.checkedInAt === null
                                    ? <div className="flex items-center gap-2 opacity-50">
                                        <CircleX className="text-red-600/80" />
                                        <span>Não fez Check-in</span>
                                    </div>
                                    : <div className="flex items-center gap-2">
                                        <CircleCheck className="text-green-600" />
                                        {dayjs().to(attendee.checkedInAt)}
                                    </div>
                                }</TableCell>
                                <td onClick={() => toggleMenu(index)} >
                                    <IconButton transparent className="bg-black/20 p-1.5 rounded-md border border-white/10">
                                        <MoreHorizontal className="size-4" />
                                    </IconButton>
                                    {menuAberto === index && (
                                        <div className="absolute">
                                            <Dropdown className="bg-zinc-800">
                                                <DropdownMenu variant="shadow" aria-label="Dropdown menu with icons">
                                                    <DropdownItem
                                                        key="edit"
                                                        startContent={<Edit className={iconClasses}
                                                        />}
                                                    >
                                                        Editar
                                                        <Modal
                                                            backdrop="opaque"
                                                            isOpen={isOpen}
                                                            onOpenChange={onOpenChange}
                                                            radius="lg"
                                                            classNames={{
                                                                body: "py-6",
                                                                backdrop: "bg-[#000000]/50 backdrop-opacity-40",
                                                                base: "border-[#292f46] bg-[#27272a] dark:bg-[#19172c] text-[#ffffff]",
                                                                header: "border-b-[1px] border-[#6b7280]",
                                                                footer: "border-t-[1px] border-[#6b7280]",
                                                                closeButton: "hover:bg-white/5 active:bg-white/10",
                                                            }}
                                                        >
                                                            <ModalContent>
                                                                {(onClose) => (
                                                                    <>
                                                                        <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
                                                                        <ModalBody>
                                                                            <Input
                                                                                autoFocus
                                                                                endContent={
                                                                                    <User className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                                                                }
                                                                                label="Email"
                                                                                placeholder="Enter your email"
                                                                                variant="bordered"
                                                                            />
                                                                            <Input
                                                                                endContent={
                                                                                    <Mail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                                                                }
                                                                                label="Password"
                                                                                placeholder="Enter your password"
                                                                                type="password"
                                                                                variant="bordered"
                                                                            />
                                                                        </ModalBody>
                                                                        <ModalFooter>
                                                                            <Button color="danger" variant="flat" onPress={onClose}>
                                                                                Fechar
                                                                            </Button>
                                                                            <Button color="primary" onPress={onClose}>
                                                                                Adicionar
                                                                            </Button>
                                                                        </ModalFooter>
                                                                    </>
                                                                )}
                                                            </ModalContent>
                                                        </Modal>
                                                    </DropdownItem>
                                                    <DropdownItem
                                                        key="delete"
                                                        className="text-danger"
                                                        color="danger"
                                                        startContent={<Trash2 className={cn(iconClasses, "text-danger")} />}
                                                    >
                                                        Excluir
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <TableCell colSpan={3}>Mostrando {attendees.length} de {total} itens</TableCell>
                        <TableCell className="text-right" colSpan={3}>
                            <div className="inline-flex items-center gap-4">
                                <span>Página {page} de {totalpages}</span>
                                <div className="flex gap-1.5">
                                    <IconButton onClick={goToFirst} disabled={page === 1}>
                                        <ChevronsLeft className="size-5" />
                                    </IconButton>
                                    <IconButton onClick={goToPrevious} disabled={page === 1}>
                                        <ChevronLeft className="size-5" />
                                    </IconButton>
                                    <IconButton onClick={goToNextPag} disabled={page === totalpages}>
                                        <ChevronRight className="size-5" />
                                    </IconButton>
                                    <IconButton onClick={goLastPage} disabled={page === totalpages}>
                                        <ChevronsRight className="size-5" />
                                    </IconButton>
                                </div>
                            </div>
                        </TableCell>
                    </tr>
                </tfoot>
            </Table>
        </div>
    )
}