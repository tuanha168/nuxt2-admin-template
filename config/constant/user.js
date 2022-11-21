export const UserConstant = Object.freeze({
  CRUMBS: [
    {
      path: '/',
      icon: 'home',
      breadcrumbName: 'home'
    },
    {
      path: '/users',
      breadcrumbName: 'Users'
    }
  ],
  COLUMNS: [
    {
      title: 'ID',
      dataIndex: '_id',
      key: 'id',
      scopedSlots: { customRender: 'id' }
    },
    {
      title: 'User Name',
      dataIndex: 'username',
      key: 'username',
      ellipsis: true
    },
    {
      title: 'Email Address',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true
    },
    {
      title: 'Gender',
      dataIndex: 'sex',
      key: 'sex',
      align: 'center',
      scopedSlots: { customRender: 'sex' },
      width: 100
    },
    {
      title: '',
      key: 'action',
      align: 'center',
      scopedSlots: { customRender: 'action' },
      width: 80
    }
  ]
})
