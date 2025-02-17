import ImageUpload from '@/components/Form/ImageUpload'
import {
  useAdvertisementCampaigns,
  useCreateAdvertisementCampaigns,
  useDeleteAdvertisementCampaigns,
  useEditAdvertisementCampaigns,
} from '@/hooks/queries'
import {
  AdvertisementCampaign,
  CreateAdvertisementCampaign,
  EditAdvertisementCampaign,
  SubscriptionSubscriber,
} from '@polar-sh/sdk'
import Button from 'polarkit/components/ui/atoms/button'
import Input from 'polarkit/components/ui/atoms/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'polarkit/components/ui/form'
import { useForm, useFormContext } from 'react-hook-form'
import { BenefitSubscriber } from '../utils'

const ConfigureAdCampaigns = ({
  benefit,
  subscription,
}: {
  benefit: BenefitSubscriber
  subscription: SubscriptionSubscriber
}) => {
  const campaigns = useAdvertisementCampaigns(subscription.id, benefit.id)

  const camps = campaigns.data?.items ?? []

  const hasCampaign = camps.length !== 0

  return (
    <div>
      {hasCampaign ? (
        <>
          {camps.map((c) => (
            <EditCampaign campaign={c} key={c.id} benefit={benefit} />
          ))}
        </>
      ) : (
        <CreateCampaign subscription={subscription} benefit={benefit} />
      )}
    </div>
  )
}

export default ConfigureAdCampaigns

const CreateCampaign = ({
  benefit,
  subscription,
}: {
  benefit: BenefitSubscriber
  subscription: SubscriptionSubscriber
}) => {
  const create = useCreateAdvertisementCampaigns()

  const form = useForm<CreateAdvertisementCampaign>({
    defaultValues: {
      subscription_id: subscription.id,
      benefit_id: benefit.id,
    },
  })
  const { handleSubmit } = form

  const onSubmit = async (
    createAdvertisementCampaign: CreateAdvertisementCampaign,
  ) => {
    await create.mutateAsync({
      createAdvertisementCampaign,
    })
  }

  if (!('image_height' in benefit.properties)) {
    return <></>
  }

  return (
    <div>
      <Form {...form}>
        <div className="flex flex-col items-start justify-between gap-12 md:flex-row">
          <div className="relative flex w-full flex-col gap-y-12 ">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="mb-8 flex items-center justify-between">
                <h1 className="font-medium">Configure Ad</h1>
              </div>

              <FormImage
                height={benefit.properties.image_height ?? 100}
                width={benefit.properties.image_width ?? 240}
                name="image_url"
                title="Light Mode"
                description="Image used for light mode"
                required={true}
              />

              <FormImage
                height={benefit.properties.image_height ?? 100}
                width={benefit.properties.image_width ?? 240}
                name="image_url_dark"
                title="Dark Mode"
                description="Image used for dark mode"
                required={false}
              />

              <FormLinkURL />
              <FormText />

              <Button type="submit">Create</Button>
            </form>
          </div>
        </div>
      </Form>
    </div>
  )
}

const EditCampaign = ({
  campaign,
  benefit,
}: {
  campaign: AdvertisementCampaign
  benefit: BenefitSubscriber
}) => {
  const edit = useEditAdvertisementCampaigns()
  const deleteAd = useDeleteAdvertisementCampaigns()

  const form = useForm<EditAdvertisementCampaign>({
    defaultValues: {
      ...campaign,
    },
  })
  const { handleSubmit } = form

  const onSubmit = async (
    editAdvertisementCampaign: EditAdvertisementCampaign,
  ) => {
    await edit.mutateAsync({
      id: campaign.id,
      editAdvertisementCampaign,
    })
  }

  const onDelete = async () => {
    await deleteAd.mutateAsync({
      id: campaign.id,
    })
  }

  if (!('image_height' in benefit.properties)) {
    return <></>
  }

  return (
    <div>
      <Form {...form}>
        <div className="flex flex-col items-start justify-between gap-12 md:flex-row">
          <div className="relative flex w-full flex-col gap-y-12 md:w-2/3">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="mb-8 flex items-center justify-between">
                <h1 className="text-lg font-medium">Update Ad</h1>
              </div>

              <FormImage
                height={benefit.properties.image_height ?? 100}
                width={benefit.properties.image_width ?? 240}
                name="image_url"
                title="Light Mode"
                description="Image used for light mode"
                required={true}
              />

              <FormImage
                height={benefit.properties.image_height ?? 100}
                width={benefit.properties.image_width ?? 240}
                name="image_url_dark"
                title="Dark Mode"
                description="Image used for dark mode"
                required={false}
              />

              <FormLinkURL />
              <FormText />

              <div className="flex gap-2">
                <Button type="submit" loading={edit.isPending}>
                  Save
                </Button>
                <Button
                  variant={'destructive'}
                  onClick={onDelete}
                  loading={deleteAd.isPending}
                >
                  Remove Ad
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Form>
    </div>
  )
}

const FormImage = ({
  height,
  width,
  name,
  title,
  description,
  required,
}: {
  height: number
  width: number
  name: 'image_url' | 'image_url_dark'
  title: string
  description?: string
  required: boolean
}) => {
  const { control } = useFormContext<CreateAdvertisementCampaign>()

  const expectedSizes = [
    [width, height],
    [width * 2, height * 2],
    [width * 3, height * 3],
  ]

  return (
    <FormField
      control={control}
      name={name}
      rules={{
        required: required ? 'This field is required' : undefined,
        minLength: 3,
        pattern: /^https:\/\//,
      }}
      render={({ field }) => {
        return (
          <FormItem className="flex flex-col gap-y-2">
            <div className="flex flex-col gap-y-2">
              <FormLabel>{title}</FormLabel>
              {description && (
                <p className="dark:text-polar-400 text-sm text-gray-600">
                  {description}
                </p>
              )}
            </div>
            <FormControl>
              <ImageUpload
                onUploaded={field.onChange}
                defaultValue={field.value}
                width={expectedSizes[0][0]}
                height={expectedSizes[0][1]}
                validate={(el) => {
                  if (el.naturalWidth === 0 && el.naturalHeight === 0) {
                    return undefined
                  }

                  const size = [el.naturalWidth, el.naturalHeight]

                  for (const expect of expectedSizes) {
                    if (expect[0] === size[0] && expect[1] === size[1]) {
                      return undefined
                    }
                  }

                  return `Expected an image with a resolution of ${expectedSizes
                    .map((v) => v.join('x'))
                    .join(' or ')}. Got ${size.join('x')}.`
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

const FormLinkURL = ({}) => {
  const { control } = useFormContext<CreateAdvertisementCampaign>()
  return (
    <FormField
      control={control}
      name="link_url"
      rules={{
        required: 'This field is required',
        minLength: 3,
        pattern: /^https:\/\//,
      }}
      render={({ field }) => {
        return (
          <FormItem>
            <div className="flex flex-row items-center justify-between">
              <FormLabel>Link</FormLabel>
            </div>
            <FormControl>
              <Input
                type="text"
                onChange={field.onChange}
                defaultValue={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

const FormText = ({}) => {
  const { control } = useFormContext<CreateAdvertisementCampaign>()
  return (
    <FormField
      control={control}
      name="text"
      rules={{
        required: 'This field is required',
        minLength: 3,
      }}
      render={({ field }) => {
        return (
          <FormItem>
            <div className="flex flex-row items-center justify-between">
              <FormLabel>Text</FormLabel>
            </div>
            <FormControl>
              <Input
                type="text"
                onChange={field.onChange}
                defaultValue={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
