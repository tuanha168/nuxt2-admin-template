export const GameConstant = Object.freeze({
  CRUMBS: [
    {
      path: '/',
      icon: 'home',
      breadcrumbName: 'home'
    },
    {
      path: '/games',
      breadcrumbName: 'Games'
    }
  ],
  COLUMNS: [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      scopedSlots: { customRender: 'id' },
      width: 220
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      scopedSlots: { customRender: 'category' },
      ellipsis: true
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      align: 'center',
      width: 100
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
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
