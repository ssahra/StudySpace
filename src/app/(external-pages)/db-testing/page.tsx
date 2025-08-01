import { Database } from '@/lib/database.types';
import { createSupabaseClient } from '@/supabase-clients/server';

type Room = Database['public']['Tables']['rooms']['Row'];

export default async function Data() {
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .returns<Room[]>(); // <--- Force return type

    if (error || !data) {
        return <p>Failed to load data</p>;
    }

    return (
        <div>
            <h1>Rooms Data From DB</h1>
            <ul>
                {data.map((room) => (
                    <li key={room.id}>
                        <strong>{room.name}</strong><br />
                        <p>{room.type}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
