/**
 * @class MODx.panel.GroupsRoles
 * @extends MODx.FormPanel
 * @param {Object} config An object of configuration properties
 * @xtype modx-panel-groups-roles
 */
MODx.panel.GroupsRoles = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'modx-panel-groups-roles'
		,cls: 'container'
        ,defaults: { collapsible: false ,autoHeight: true }
        ,forceLayout: true
        ,items: [{ 
             html: '<h2>'+_('user_group_management')+'</h2>'
            ,border: false
            ,cls: 'modx-page-header'
            ,id: 'modx-access-permissions-header'
        },MODx.getPageStructure(this.getPageTabs(config),{
            id: 'modx-access-permissions-tabs'
            ,stateful: true
            ,stateId: 'access-tabpanel'
            ,stateEvents: ['tabchange']
            ,getState:function() {
                return {activeTab:this.items.indexOf(this.getActiveTab())};
            }
        })]
    });
    MODx.panel.GroupsRoles.superclass.constructor.call(this,config);
    var _this = this;
    Ext.getCmp('modx-tree-usergroup').on('expandnode', function(node){
        _this.fixPanelHeight();
    });
    Ext.getCmp('modx-tree-usergroup').on('collapsenode', function(node){
        _this.fixPanelHeight();
    });
    if (MODx.perm.usergroup_user_list == 1) {
        Ext.getCmp('modx-tree-usergroup').on('click', function(node,e){
            _this.getUsers(node);
        });
    }
};
Ext.extend(MODx.panel.GroupsRoles,MODx.FormPanel,{
    getPageTabs: function(config) {
        var tbs = [];
        if (MODx.perm.usergroup_view == 1) {
            tbs.push({
                title: _('user_groups') + ' & ' + _('users')
                ,autoHeight: true
                ,layout: 'form'
                ,items: [{
                    html: '<p>'+_('user_group_management_msg')+'</p>'
                    ,bodyCssClass: 'panel-desc'
                    ,border: false
                },{
                    layout: 'border'
                    ,id: 'modx-tree-panel-usergroup'
                    ,height: 500
                    ,items: [
                        {
                            region:'west'
                            ,cls:'main-wrapper'
                            ,collapsible: true
                            ,split: true
                            ,width: 270
                            ,minSize: 270
                            ,maxSize: 400
                            ,layout: 'fit'
                            ,items: [
                                {
                                    xtype: 'modx-tree-usergroup'
                                }
                            ]
                        }, {
                            region: 'center'
                            ,id: 'modx-usergroup-users'
                            ,layout: 'fit'
                        }
                    ]
                }]
            });
        }
        if (MODx.perm.view_role == 1) {
            tbs.push({
                title: _('roles')
                ,autoHeight: true
                ,layout: 'form'
                ,items: [{
                    html: '<p>'+_('roles_msg')+'</p>'
                    ,bodyCssClass: 'panel-desc'
                    ,border: false
                },{
                    xtype: 'modx-grid-role'
                    ,cls:'main-wrapper'
                    ,title: ''
                    ,preventRender: true
                }]
            });
        }
        if (MODx.perm.policy_view == 1) {
            tbs.push({
                title: _('policies')
                ,id: 'modx-panel-access-policies'
                ,autoHeight: true
                ,layout: 'form'
                ,items: [{
                    html: '<p>'+_('policy_management_msg')+'</p>'
                    ,bodyCssClass: 'panel-desc'
                    ,border: false
                },{
                    xtype: 'modx-grid-access-policy'
                    ,cls:'main-wrapper'
                }]
            });
        }
        if (MODx.perm.policy_template_view) {
            tbs.push({
                title: _('policy_templates')
                ,id: 'modx-panel-access-policy-templates'
                ,autoHeight: true
                ,layout: 'form'
                ,items: [{
                    html: '<p>'+_('policy_templates.intro_msg')+'</p>'
                    ,bodyCssClass: 'panel-desc'
                    ,border: false
                },{
                    xtype: 'modx-grid-access-policy-templates'
                    ,cls:'main-wrapper'
                }]
            });
        }
        return tbs;
    }
    ,getUsers: function(node) {
        var center = Ext.getCmp('modx-usergroup-users');
        center.removeAll();
        var id = node.attributes.id;
        var usergroup = id.replace('n_ug_', '') - 0; // typecasting
        usergroup = usergroup === 0 ? 'anonymous' : usergroup;
        var userGrid = new MODx.grid.UsergroupUsers({
            usergroup: usergroup
        });
        var _this = this;
        userGrid.on('resize', function(){
            Ext.getCmp('modx-usergroup-users').getEl().setHeight(userGrid.getEl().getHeight());
            _this.fixPanelHeight();
        });
        center.add(userGrid);
        center.doLayout();
    }
    ,fixPanelHeight: function() {
        // fixing border layout's height regarding to tree panel's
        var treeEl = Ext.getCmp('modx-tree-usergroup').getEl();
        var treeH = treeEl.getHeight();
        var tb = treeEl.up('.main-wrapper').down('.x-panel-header');
        var xHeight = tb.getHeight() + 20; // 10px x 2 padding
        var wH = treeH+xHeight;
        var cHeight = Ext.getCmp('modx-usergroup-users').getEl().getHeight();
        var maxH = (wH > cHeight) ? wH : cHeight;
        maxH = maxH > 500 ? maxH : 500;
        Ext.getCmp('modx-tree-panel-usergroup').getEl().setHeight(maxH);
    }
});
Ext.reg('modx-panel-groups-roles',MODx.panel.GroupsRoles);