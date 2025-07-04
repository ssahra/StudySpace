import { Database } from '@/lib/database.types';
import { createSupabaseClient } from '@/supabase-clients/server';
import { cookies, headers } from 'next/headers';

type Room = Database['public']['Tables']['rooms']['Row']


export default async function Data() {

    const supabase = createSupabaseClient({
        cookies: cookies(),
        headers: headers(),
    })


    const { data, error } = await supabase
        .from('rooms')
        .select('*')

    if (error) {
        console.error('Error fetching data:', error)
        return <p>Failed to load data</p>
    }

    console.log('Supabase data:', data)

    return (
        <div>
            <h1>Rooms Data From DB</h1>

            <ul>
                {data?.length ? (
                    data.map((room: Room) => (
                        <li key={room.id}>
                            <strong>{room.name}</strong><br />
                            <p>{room.type}</p>
                        </li>
                    ))
                ) : (
                    <li>No rooms found</li>
                )}

            </ul>
        </div>
    )
}