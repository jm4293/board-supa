'use server';

import dayjs from 'dayjs';

import { createClient } from '@/config/supabase/server';

import { ResponseType } from '@/share/type';

export async function uploadImageAction(formData: FormData): Promise<
  ResponseType<{
    fullPath: string;
    id: string;
    path: string;
  } | null>
> {
  const image = formData.get('image') as File;

  const supabase = await createClient();

  const today = dayjs().format('YYYY-MM-DD');
  const timeNow = dayjs().format('HH-mm-ss');

  const { data, error } = await supabase.storage.from('images').upload(`${today}/${timeNow}-${image.name}`, image, {
    contentType: image.type,
  });

  if (error) {
    return {
      success: false,
      data: null,
      message: error.message,
    };
  }

  return {
    success: true,
    data: data,
    message: null,
  };
}
