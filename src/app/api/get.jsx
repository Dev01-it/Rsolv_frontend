
import { Base_url } from "./post";

export async function fetchMenuItems_byType(type){
  const res = await fetch(`${Base_url}api/menu-items?parent_option=${encodeURIComponent(type)}`);
  if(!res.ok) throw new Error(`failed to fetch menu items by ${type} `)
  return await res.json();
}
export async function fetch_applicationnotes_by_column_type(type){
  const res = await fetch(`${Base_url}api/application-notes?Column_type=${encodeURIComponent(type)}`);
  if(!res.ok) throw new Error(`failed to fetch menu items by ${type} `)
  return await res.json();
}
export async function fetch_applicationnote_by_slug(slug){
  if (!slug) throw new Error('missing slug')
  const url = `${Base_url}api/application-notes/slug/${encodeURIComponent(slug)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`failed to fetch application note ${slug} (status ${res.status})`)
  return await res.json()
}