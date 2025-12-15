import DT from 'datatables.net-dt';
import { Suspense, lazy } from 'react';
import './Datatable.css';

// Lazy load DataTable + skin
const DataTable = lazy(async () => {
    const { default: DataTable } = await import('datatables.net-react');
    DataTable.use(DT);
    return { default: DataTable };
});

const CustomDataTable = ({
    children,
    options = {},
    sorting = [[0, 'asc']],
    optionItems = {},
}: {
    children: React.ReactNode;
    options?: object | null;
    sorting?: Array<[number, string]>;
    optionItems?: object | null;
}) => {
    const props = {
        ...options,
        options: {
            pageLength: 100,
            order: sorting,
            serverSide: true,
            layout: {
                topStart: 'search',
                topEnd: 'pageLength',
            },
            ...optionItems,
        },
    };

    return (
        <Suspense fallback={<div>Loading table...</div>}>
            <DataTable {...(props as object)}>{children}</DataTable>
        </Suspense>
    );
};

export default CustomDataTable;

