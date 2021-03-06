<import resource="classpath:/alfresco/templates/org/alfresco/import/alfresco-util.js">

function getActivityParameters(nodeRef, defaultValue)
{
   var cm = "{http://www.alfresco.org/model/content/1.0}",
      metadata = AlfrescoUtil.getMetaData(nodeRef, {});
   if (metadata.properties)
   {
      if (model.activityType == "document")
      {
         return (
         {
            itemTitle: metadata.properties[cm + 'name'],
            page: 'document-details',
            pageParams:
            {
               nodeRef: metadata.nodeRef
            }
         });
      }
      else if (model.activityType == "folder")
      {
         return (
         {
            itemTitle: metadata.properties[cm + 'name'],
            page: 'folder-details',
            pageParams:
            {
               nodeRef: metadata.nodeRef
            }
         });
      }
      else if (model.activityType == "link")
      {
         var lm = "{http://www.alfresco.org/model/linksmodel/1.0}";
         return (
         {
            itemTitle: metadata.properties[lm + "title"],
            page: 'links-view',
            pageParams:
            {
               linkId: metadata.properties[cm + "name"]
            }
         });
      }
      else if (model.activityType == "blog")
      {
         return (
         {
            itemTitle: metadata.properties[cm + 'title'],
            page: 'blog-postview',
            pageParams:
            {
               postId: metadata.properties[cm + "name"]
            }
         });
      }
   }
   return defaultValue;
}

function main()
{
   AlfrescoUtil.param('nodeRef', null);
   AlfrescoUtil.param('site', null);
   AlfrescoUtil.param('maxItems', 10);
   AlfrescoUtil.param('activityType', null);

   if (!model.nodeRef)
   {
      // Handle urls that doesn't use nodeRef
      AlfrescoUtil.param('postId', null);
      if (model.postId)
      {
         // translate blog post "postId" to a nodeRef
         AlfrescoUtil.param('container', 'blog');
         model.nodeRef = AlfrescoUtil.getBlogPostDetailsByPostId(model.site, model.container, model.postId, {}).nodeRef;
      }
      else
      {
         AlfrescoUtil.param('linkId', null);
         if (model.linkId)
         {
            // translate link's "linkId" to a nodeRef
            AlfrescoUtil.param('container', 'links');
            model.nodeRef = AlfrescoUtil.getLinkDetailsByPostId(model.site, model.container, model.linkId, {}).nodeRef;
         }
      }
   }

   var documentDetails = AlfrescoUtil.getNodeDetails(model.nodeRef, model.site);
   var activityParameters = null;
   if (documentDetails)
   {
      activityParameters = getActivityParameters(model.nodeRef, null);
   }
   else
   {
      // Signal to the template that the node doesn't exist and that comments therefore shouldn't be displayed.
      model.nodeRef = null;
   }
   
   // Widget instantiation metadata...
   var locale = this.locale.substring(0, 2);
   var commentList = {
      id : "CommentsList",
      name : "Alfresco.CommentsList",
      options : {
         nodeRef : model.nodeRef,
         siteId : model.site,
         maxItems : parseInt(model.maxItems),
         activity :  activityParameters,
         editorConfig : {
            inline_styles: false,
            convert_fonts_to_spans: false,
            theme: "advanced",
            plugins: "asciimath,table,visualchars,emotions,advhr,print,directionality,fullscreen,insertdatetime",
            theme_advanced_buttons1: "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,formatselect,fontselect,fontsizeselect,forecolor,backcolor",
            theme_advanced_buttons2: "bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,alfresco-imagelibrary,alfresco-linklibrary,image,cleanup,help,code,removeformat,|,insertdate,inserttime",
            theme_advanced_buttons3: "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,asciimath,emotions,advhr,|,print,|,ltr,rtl,|,fullscreen",
            theme_advanced_toolbar_location: "top",
            theme_advanced_toolbar_align: "left",
            theme_advanced_statusbar_location: "bottom",
            theme_advanced_path : false,
            theme_advanced_resizing: true,
            language: locale
         }
      }
   };
   model.widgets = [commentList];
}

main();
