import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { DataTable, RowDataWithActions } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { PopulatedFlow } from "@activepieces/shared"
import { PieceIconList } from "@/features/pieces/components/piece-icon-list"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import FlowStatusToggle from "@/features/flows/components/flow-status-toggle"
import { flowsApi } from "@/features/flows/lib/flows-api"
import { authenticationSession } from "@/features/authentication/lib/authentication-session"
import { formatUtils } from "@/lib/utils"
import { FolderBadge } from "@/features/folders/component/folder-badge"

const columns: ColumnDef<RowDataWithActions<PopulatedFlow>>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => {
            const status = row.original.version.displayName
            return <div className="text-left">{status}</div>
        },
    },
    {
        accessorKey: "steps",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Steps" />,
        cell: ({ row }) => {
            return <>
                <PieceIconList flow={row.original} />
            </>
        },
    },
    {
        accessorKey: "folderId",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Folder" />,
        cell: ({ row }) => {
            const folderId = row.original.folderId
            return <div className="text-left">{folderId ? <FolderBadge folderId={folderId} /> : <span>Uncategorized</span>}</div>
        },
    },
    {
        accessorKey: "created",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
        cell: ({ row }) => {
            const created = row.original.created
            return <div className="text-left font-medium">{formatUtils.formatDate(new Date(created))}</div>
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
            return <>
                <FlowStatusToggle flow={row.original} />
            </>
        }
    }

]

async function fetchData(pagination: { cursor?: string, limit: number }) {
    return flowsApi.list({
        projectId: authenticationSession.getProjectId(),
        cursor: pagination.cursor,
        limit: pagination.limit,
    })
}

const FlowsTable = () => {

    const navigate = useNavigate();

    return (
        <div className="container mx-auto  flex-col">
            <div className="flex mb-4">
                <h1 className="text-3xl font-bold">Flows</h1>
                <div className="ml-auto">
                    <Link to='/builder'>
                        <Button variant="default" >New flow</Button>
                    </Link>
                </div>
            </div>
            <DataTable columns={columns} fetchData={fetchData} onRowClick={(row) => navigate(`/flows/${row.id}`)} />
        </div>
    )
}

export { FlowsTable }