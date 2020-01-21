<template>
<a-card :bordered="false" class="card-area">
    <!-- 搜索区域 -->
    <div :class="advanced ? 'search' : null">
        <a-form class="ant-advanced-search-form" :form="form">
        <a-row>
            <a-col :span="8" :style="{ display: 0 < count ? 'block':'none' }">
                <a-form-item label="活动名称"
                    :labelCol="{span: 6}"
                    :wrapperCol="{span: 12, offset: 1}">
                    <a-input v-model="queryParams.projectName"
                        style="width: 200px;" placeholder="活动名称--模糊匹配"/>
                </a-form-item>
            </a-col>
        </a-row>
        <a-row>
            <a-col :span="12" :style="{ textAlign: 'left' }">
                <span style="float: left; margin-top: 3px;">
                    <!-- v-hasPermission="'lottery:add'" v-hasPermission="'lottery:delete'" -->
                    <a-button type="primary" class='button' @click="add">新增</a-button>
                    <a-button class='button' @click="batchDelete">删除</a-button>
                </span>
            </a-col>
            <a-col :span="12" :style="{ textAlign: 'right' }">
                <span style="float: right; margin-top: 3px;">
                    <!-- v-hasPermission="'lottery:list'" v-hasPermission="'lottery:list'" -->
                    <a-button type="primary" class='button' @click="search">查询</a-button>
                    <a-button class='button' @click="reset">重置</a-button>
                    <span style="display: none;">
                        <a @click="toggleAdvanced" style="margin-left: 8px">{{advanced ? '收起' : '展开'}}<a-icon :type="advanced ? 'up' : 'down'"></a-icon></a>
                    </span>
                </span>
            </a-col>
        </a-row>
        </a-form>
    </div>
        <!-- 表格区域 -->
    <div class="search-result-list">
    <a-table ref="TableInfo"
                :columns="columns"
                :dataSource="dataSource"
                :pagination="pagination"
                :loading="loading"
                :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                :scroll="{ x: 900 }"
                @change="handleTableChange"
                style="height: 50%;">
                <template slot="timeRange" slot-scope="text, record">
                    <div v-if="record.startTime != null & record.endTime != null">
                        {{record.startTime.substring(0, 16)}}~{{record.endTime.substring(0, 16)}}
                    </div>
                </template>
                <template slot="lotteryProbabilty" slot-scope="text, record">
                    <div v-if="record.lotteryPerCount != null & record.lotteryPerCount != '' ">
                        每{{record.lotteryPerCount}}个参与者抽中一个奖品
                    </div>
                    <div v-if="record.lotteryPercent != null & record.lotteryPercent != ''">
                        有{{record.lotteryPercent}}%参与者可以抽中奖品
                    </div>
                    <div v-if="record.lotteryAllowMostDay != -1 & record.lotteryAllowMostDay > 0">
                        允许每天最多抽中{{record.lotteryAllowMostDay}}个奖品
                    </div>
                </template>
                <template slot="lotteryChance" slot-scope="text, record">
                    <div v-if="record.lotteryAllowone == 1">
                        用户的中奖次数不限制
                    </div>
                    <div v-else>
                        用户只能中奖一次
                    </div>
                    <div v-if="record.lotteryAllowtwo == 1">
                        注册用户可以抽奖两次
                    </div>
                    <div v-else>
                        用户只能抽奖一次
                    </div>
                </template>
                <template slot="lotteryDisplay" slot-scope="text, record">
                    <div v-if="record.lotteryNotification == 1">
                        审核通过后不通知获奖者
                    </div>
                    <div v-else>
                        审核通过后短信通知获奖者
                    </div>
                    <div v-if="record.lotteryNonDisplay == 1">
                        不显示奖品信息
                    </div>
                    <div v-else>
                        显示奖品信息
                    </div>
                    <div v-if="record.lotteryNonList == 1">
                        不显示获奖名单
                    </div>
                    <div v-else>
                        显示获奖名单
                    </div>
                </template>
                <template slot="operation" slot-scope="text, record, index">
                    <a-tooltip style="margin-left:10px">
                        <template slot='title'>编辑</template>
                        <a href="javascript:;">
                            <!-- v-hasPermission="'lottery:edit'" -->
                            <a-icon type="setting" @click="settingProject(record,index)"/>
                        </a>
                    </a-tooltip>
                    <a-tooltip style="margin-left:10px" v-if="record.projectStatus == 0">
                        <template slot='title'>关闭</template>
                        <a href="javascript:;">
                            <!-- v-hasPermission="'lottery:close'" -->
                            <a-icon type="poweroff" @click="projectDown(record)"/>
                        </a>
                    </a-tooltip>
                    <a-tooltip style="margin-left:10px" v-if="record.projectStatus == 1">
                        <template slot='title'>启用</template>
                        <a href="javascript:;">
                            <!-- v-hasPermission="'lottery:up'" -->
                            <a-icon type="check" @click="projectUp(record)"/>
                        </a>
                    </a-tooltip>
                        <a-tooltip style="margin-left:10px">
                        <template slot='title'>数据分析</template>
                        <a href="javascript:;">
                            <!-- v-hasPermission="'lottery:display'" -->
                            <a-icon type="pie-chart" @click="displaySis(record)"/>
                        </a>
                    </a-tooltip>
                    <!-- v-hasNoPermission="'lottery:edit','lottery:up','lottery:close','lottery:display'" -->
                    <a-badge status="warning" text="无权限"></a-badge>
                </template>
    </a-table>
    </div>
    <!-- 添加活动
    <lottery-proj-add
        ref="projectAdd"
        @close="handleProjAddClose"
        @success="handleProjAddSuccess"
        :projAddVisiable="projAddVisiable">
    </lottery-proj-add>-->
    <!-- 编辑活动
    <lottery-proj-edit
        ref="projectEdit"
        @close="handleProjEditClose"
        @success="handleProjEditSuccess"
        :projEditVisiable="projEditVisiable">
    </lottery-proj-edit>
    <result-display
        ref="resultDisplay"
        @close="handleResultDisplayClose"
        :resultDisplayVisiable="resultDisplayVisiable">
    </result-display> -->
</a-card>
</template>
<script>
// eslint-disable-next-line
/* eslint-disable */
//import LotteryProjAdd from './LotteryProjAdd'
//import LotteryProjEdit from './LotteryProjEdit'
//import ResultDisplay from './ResultDisplay'
export default {
    name: 'LotteryList',
    //components:{LotteryProjAdd, LotteryProjEdit, ResultDisplay},
    data(){
        return{
            dataSource: [],
            form: this.$form.createForm(this),
            pagination: {
                pageSizeOptions: ['10', '20', '30', '40', '100'],
                defaultCurrent: 1,
                defaultPageSize: 10,
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
            },
            loading: false,
            selectedRowKeys: [],
            paginationInfo: null,
            queryParams: {},
            projAddVisiable: false,
            projEditVisiable: false,
            resultDisplayVisiable: false,
            advanced: false,
            delayTime: 50,
            editIndex:0
        }
    },
    computed: {
        count() {
            return this.advanced ? 4:3
        },
        columns() {
            return [
                {
                    title: '活动名称',
                    dataIndex: 'projectName',
                    align: 'center'
                },{
                    title: '起止时间',
                    dataIndex: 'timeRange',
                    align: 'center',
                    scopedSlots: { customRender: 'timeRange' },
                },{
                    title: '奖品配置',
                    dataIndex: 'prizeConfName',
                    align: 'center'
                },{
                    title: '抽奖概率',
                    dataIndex: 'lotteryProbabilty',
                    scopedSlots: { customRender: 'lotteryProbabilty' },
                    align: 'center'
                },{
                    title: '抽奖机会',
                    dataIndex: 'lotteryChance',
                    scopedSlots: { customRender: 'lotteryChance' },
                    align: 'center'
                },{
                    title: '中奖显示',
                    dataIndex: 'lotteryDisplay',
                    scopedSlots: { customRender: 'lotteryDisplay' },
                    align: 'center'
                },{
                    title: '用户类别',
                    dataIndex: 'userType',
                    align: 'center',
                    customRender: (text, row, index) => {
                        switch(text) {
                            case '0':
                                return '点点通用户'
                            case '1':
                                return '点点通注册用户'
                            case '2':
                                return '点点通认证用户'
                            case '3':
                                return '点点通认证不含H3C用户'
                        }
                    }
                },{
                    title: '创建人',
                    dataIndex: 'pubUserName',
                    align: 'center',
                    customRender: (text, row, index) => {
                        if(!text || text == 'undefined') {
                            return ''
                        } else {
                            return text
                        }
                    }
                },{
                    title: '状态',
                    dataIndex: 'projectStatus',
                    align: 'center',
                    customRender: (text, row, index) => {
                        switch(text) {
                            case 0:
                                return '启用'
                            case 1:
                                return '关闭'
                        }
                    }
                },{
                    title: '操作',
                    dataIndex: 'operation',
                    scopedSlots: { customRender: 'operation' },
                    fixed: 'right',
                    width: 150,
                    align: 'center'
                }
            ]
        }
    },
    mounted() {
        this.fetch()
    },
    methods: {
        onSelectChange(selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys
        },
        toggleAdvanced() {
            this.advanced = !this.advanced
            if (this.advanced) {
            } else {
            }
        },
        search() {
            this.fetch({
                ...this.queryParams
            })
        },
        reset() {
            this.resetParam()
            this.fetch()
        },
        resetParam() {
            this.dataSource = []
            this.selectedRowKeys = []
            // 重置分页
            this.$refs.TableInfo.pagination.current = this.pagination.defaultCurrent
            if (this.paginationInfo) {
                this.paginationInfo.current = this.pagination.defaultCurrent
                this.paginationInfo.pageSize = this.pagination.defaultPageSize
            }
            // 重置查询参数
            this.queryParams = {
                projectName: ''
            }
        },
        handleTableChange(pagination) {
            this.selectedRowKeys = []
            // 将这三个参数赋值给Vue data，用于后续使用
            this.paginationInfo = pagination
            this.fetch({
                ...this.queryParams
            })
        },
        add() {
            this.projAddVisiable= true
            this.$refs.projectAdd.current = 0
            this.$refs.projectAdd.getAllConfNames()
        },
        displaySis(record) {
            this.$get('lottery/project/checkDisplay/' + record.id).then((r) => {
                if(r.data) {
                    this.resultDisplayVisiable= true
                    this.$refs.resultDisplay.getDispalyData(record.id)
                    setTimeout(() => {
                        this.$refs.resultDisplay.drawPie()
                    }, 1500)
                    
                } else {
                    this.$message.error('数据分析功能仅在活动结束后可用')
                }
            })
        },
        handleProjAddClose() {
            this.projAddVisiable= false
        },
        handleProjEditClose() {
            this.projEditVisiable= false
        },
        handleResultDisplayClose() {
            this.resultDisplayVisiable= false
        },
        handleProjAddSuccess() {
            this.projAddVisiable= false
            this.$message.success('添加活动成功')
            this.queryParams.projectName = ''
            this.search()
        },
        handleProjEditSuccess() {
            this.projEditVisiable= false
            this.$message.success('编辑活动成功')
            //this.queryParams.projectName = ''
            this.search()
        },
        settingProject(record, index) {
            //this.$refs.projectEdit.reset()
            this.projEditVisiable = true
            this.$refs.projectEdit.steps=[{
                    title: '基础信息',
                    status: 'process'
                },
                {
                    title: '活动信息',
                    status: 'wait'
                },
                {
                    title: '抽奖配置',
                    status: 'wait'
                },
                {
                    title: '中奖概率',
                    status: 'wait'
            }]
            this.$refs.projectEdit.steps.current = 0
            this.$refs.projectEdit.setFormValues(record)
            this.$refs.projectEdit.dealRule(record)
            this.editIndex=index
        },
        projectUp(record) {
            let that = this
            this.$confirm({
                title: '确定启用抽奖活动吗?',
                content: '当您点击确定按钮后，抽奖活动将正式启用',
                centered: true,
                onOk () {
                    that.loading = true
                    that.$get('lottery/project/projectUp/' + record.id).then((r) => {
                        that.loading = false
                        if(r.data.code == 0) {
                            that.$message.success('启动成功')
                            that.search()
                        } else {
                            that.$message.error(r.data.msg)
                        }
                    })
                },
                onCancel () {}
            })
        },
        projectDown(record) {
            let that = this
            this.$confirm({
                title: '确定关闭抽奖活动吗?',
                content: '当您点击确定按钮后，抽奖活动将正式关闭',
                centered: true,
                onOk () {
                    that.loading = true
                    that.$get('lottery/project/projectDown/' + record.id).then((r) => {
                        that.loading = false
                        if(r.data.code == 0) {
                            that.$message.success('关闭成功')
                            that.search()
                        } else {
                            that.$message.error(r.data.msg)
                        }
                    })
                },
                onCancel () {}
            })
        },
        fetch(params = {}) {
            // 显示loading
            this.loading = true
            if (this.paginationInfo) {
                // 如果分页信息不为空，则设置表格当前第几页，每页条数，并设置查询分页参数
                this.$refs.TableInfo.pagination.current = this.paginationInfo.current
                this.$refs.TableInfo.pagination.pageSize = this.paginationInfo.pageSize
                params.pageSize = this.paginationInfo.pageSize
                params.pageNum = this.paginationInfo.current
            } else {
                // 如果分页信息为空，则设置为默认值
                params.pageSize = this.pagination.defaultPageSize
                params.pageNum = this.pagination.defaultCurrent
            }
            this.$post('lottery/project/list', {
                ...params
            }).then((r) => {
                let data = r.data
                const pagination = { ...this.pagination }
                pagination.total = data.total
                this.dataSource = data.rows
                this.pagination = pagination
                // 数据加载完毕，关闭loading
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },
        batchDelete() {
            if (!this.selectedRowKeys.length) {
                this.$message.warning('请选择需要删除的记录')
                return
            }
            let that = this
            this.$confirm({
                title: '确定删除所选中的记录?',
                content: '当您点击确定按钮后，这些记录将会被彻底删除',
                centered: true,
                onOk () {
                    that.loading = true
                    let ids = []
                    for (let key of that.selectedRowKeys) {
                        ids.push(that.dataSource[key].id)
                    }
                    that.$delete('lottery/project/deleteProject/' + ids.join(',')).then(() => {
                        that.loading = false
                        that.$message.success('删除成功')
                        that.selectedRowKeys = []
                        that.queryParams.projectName = ''
                        that.search()
                    })
                },
                onCancel () {}
            })
        },
        singleDelete (record) {
            let that = this
            this.$confirm({
                title: '确定删除所选中的记录?',
                content: '当您点击确定按钮后，记录将会被彻底删除',
                centered: true,
                onOk () {
                    that.loading = true
                    that.$delete('lottery/project/deleteProject/' + record.id).then(() => {
                        that.loading = false
                        that.$message.success('删除成功')
                        that.selectedRowKeys = []
                        that.search()
                    })
                },
                onCancel () {}
            })
        }
    }
}
</script>
<style lang="less" scoped>
@import "../../../static/less/Common";
.ant-advanced-search-form {
    padding: 15px;
    border:1px solid #d9d9d9;
    border-radius: 6px;
}
.ant-advanced-search-form .ant-form-item {
    display: flex;
}
.ant-advanced-search-form .ant-form-item-controller-wrapper {
    flex: 1
}
.search-result-list {
    margin-top: 16px;
    border: 1px solid #e9e9e9;
    border-radius: 6px;
}
</style>
