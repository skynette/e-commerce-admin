'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'

import { Modal } from '@/components/ui/modal'
import { useStoreModal } from '@/hooks/use-store-model'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

const formSchema = z.object({
    name: z.string().min(1),
})

const StoreModal = () => {
    const storeModal = useStoreModal()

    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // todo: create store
        try {
            setLoading(true)
            
            // create the store
            const response = await axios.post('/api/stores', values)
            window.location.assign(`/${response.data.id}`)
            
        } catch (error) {
            toast.error('Something went wrong')
            console.log(error)
        } finally{
            setLoading(false)
        }
    }

    return (
        <Modal
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}
            title="Create store"
            description="Add a new store to manage products and categories"
        >
            <div>
                <div className='space-y-4 py-2 pb-4'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder='E-commerce' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
                                <Button
                                    disabled={loading}
                                    variant="outline"
                                    onClick={storeModal.onClose}
                                    type='button'
                                >
                                    Cancel
                                </Button>
                                <Button disabled={loading} type='submit'>Continue</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div >
        </Modal >
    )
}

export default StoreModal