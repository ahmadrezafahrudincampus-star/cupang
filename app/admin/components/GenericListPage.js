'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function GenericListPage({ title, table, createRoute, columns = [] }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const supabase = createClient()

    async function loadData() {
      const { data } = await supabase.from(table).select('*').limit(50)
      if (active) {
        if (data) setItems(data)
        setLoading(false)
      }
    }

    loadData()
    return () => { active = false }
  }, [table])

  const handleDelete = async (id) => {
    if (confirm(`Delete this ${title}?`)) {
      const supabase = createClient()
      await supabase.from(table).delete().eq('id', id)
      setItems((prev) => prev.filter((item) => item.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        {createRoute && (
          <Link
            href={createRoute}
            className="px-4 py-2 bg-primary text-black font-semibold rounded hover:bg-opacity-90"
          >
            Create New
          </Link>
        )}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-surface border border-white/[0.08] rounded overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-surface-container">
                {columns.map((c) => (
                  <th key={c.key} className="p-4 font-semibold text-sm">{c.label}</th>
                ))}
                <th className="p-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-white/[0.08] hover:bg-surface-container">
                  {columns.map((c) => (
                    <td key={c.key} className="p-4 text-sm">
                      {c.render ? c.render(item[c.key], item) : item[c.key]?.toString()}
                    </td>
                  ))}
                  <td className="p-4 text-sm space-x-2">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="p-8 text-center text-on-surface-variant">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
