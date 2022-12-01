export const CategoryConstant = Object.freeze({
  CRUMBS: [
    {
      path: '/',
      icon: 'home',
      breadcrumbName: 'home'
    },
    {
      path: '/categories',
      breadcrumbName: 'Categories'
    }
  ],
  COLUMNS: [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      scopedSlots: { customRender: 'image' },
      width: 200
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      scopedSlots: { customRender: 'timeFormat' }
    },
    {
      title: 'Created At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      align: 'center',
      scopedSlots: { customRender: 'timeFormat' }
    },
    {
      title: '',
      key: 'action',
      align: 'center',
      scopedSlots: { customRender: 'action' },
      width: 100
    }
  ]
})
