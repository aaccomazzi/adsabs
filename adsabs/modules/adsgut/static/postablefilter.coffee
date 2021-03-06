root = exports ? this
$=jQuery
#console.log "In Funcs"
h = teacup

flip_sorter = (qstr) ->
    #console.log "qstring", qstr
    qlist=qstr.split('&')
    #console.log "qlist", qlist
    sortstring = ""
    otherqlist=[]
    for q in qlist
        n = q.search("sort")
        if n==0
            sortstring=q.split('=')[1]
        else
            otherqlist.push(q)
    if sortstring!=''
        [f,a]=sortstring.split(':')
        if f=='posting__thingtopostname'
            fnowtext = "by paper year"
            ftext = 'Sort By Post'
            fout = 'posting__whenposted'
        if f=='posting__whenposted'
            fnowtext = "by posting time"
            ftext = 'Sort By Year'
            fout = 'posting__thingtopostname'
        if a=='True'
            anowtext = "earliest first"
            atext = '<i class="icon-arrow-down"></i>'
            aout = 'False'
        if a=='False'
            anowtext = "latest first"
            atext = '<i class="icon-arrow-up"></i>'
            aout = 'True'
    else
        f = 'posting__whenposted'
        a = 'False'
        fnowtext = "by posting time"
        anowtext = "latest first"
        ftext = 'Sort By Year'
        atext = '<i class="icon-arrow-up"></i>'
        fout = 'posting__thingtopostname'
        aout = 'True'
    odict=
        fnow:f
        anow:a
        fnowtext:fnowtext
        anowtext:anowtext
        ftext:ftext
        atext:atext
        fout:fout
        aout:aout
        oqs:otherqlist.join('&')
    return odict




csvstringify = (tdict) ->
  start="#paper, tag\n"
  for bibcode of tdict
    for tag in tdict[bibcode]
      start=start+bibcode+","+tag+"\n"
  return start
#redo this to use url parsing library, handle other types of queries besides tags
parse_querystring= (qstr) ->
    #console.log "QQQ", qstr
    qlist=qstr.split('&')
    #TODO: remove sorting and userthere from here
    qlist = _.difference(qlist,['query=tagtype:ads/tagtype:tag'])
    qlist = (q.replace('query=tagname:','') for q in qlist)
    q2list=[]
    for q in qlist
        n = q.search("sort")
        if n!=0
            q2list.push(q)
    if q2list.length==1 and q2list[0]==""
        q2list=[]
    #console.log "QLIST", qlist
    return q2list

make_editable_description = ($infodiv, fqpn) ->
    cback = () ->
        #console.log "cback"
    eback = () ->
        #console.log "eback"
    $.fn.editable.defaults.mode = 'inline'
    $infodiv.find('.edtext').editable(
      type:'textarea'
      rows: 2
      url: (params) ->
        syncs.change_description(params.value,fqpn, cback, eback)
    )
    $infodiv.find('.edclick').click (e) ->
      e.stopPropagation()
      e.preventDefault()
      $infodiv.find('.edtext').editable('toggle')

do_postable_info = (sections, config, ptype) ->
    $.get config.infoURL, (data) ->
        if ptype=='library'
            content=views.library_info config.owner, data, templates.library_itemsinfo
        else if ptype=='group'
            content=views.group_info config.owner, data, templates.group_itemsinfo
        sections.$info.append(content+'<hr/>')
        if config.owner
            make_editable_description(sections.$info, config.fqpn)
        sections.$info.show()

do_tags = (url, $sel, tqtype) ->
    $.get url, (data) ->
        #console.log "DATA", data
        for own k,v of data.tags
            format_tags(k, $sel, get_tags(v, tqtype), tqtype)

do_postable_filter = (sections, config, tagfunc) ->
    #console.log "CONFIG", config
    # $.get config.tagsPURL, (data) ->
    #     for own k,v of data.tags
    #         format_tags(k, sections.$tagssec, get_tags(v, config.tqtype), config.tqtype)
    #do_tags(config.tagsPURL, sections.$tagssec, config.tqtype)
    #$.get "#{config.tagsucwtURL}?tagtype=ads/tagtype:tag&fqpn=#{config.fqpn}", (data) ->
    tagfunc()
    $.get "#{config.tagsucwtURL}?tagtype=ads/tagtype:tag", (data) ->
        suggestions=data.simpletags
        #console.log "SUGG", suggestions, config.fqpn
        qtxtlist = parse_querystring(config.querystring)
        if qtxtlist.length > 0
            sections.$breadcrumb.text('Tags: ')
            for e in qtxtlist
                if e=="userthere=true"
                    e = "Posted by you"
                sections.$breadcrumb.append("<span class='badge'>#{e}</span>&nbsp;")
            sections.$breadcrumb.show()
        $.get config.itemsPURL, (data) ->
            theitems=data.items
            #console.log("THEITEMS", theitems, data)
            if theitems.length ==1
                sections.$count.text("#{theitems.length} paper. ")
            else
                sections.$count.text("#{theitems.length} papers. ")
            sections.$count.show()
            thecount=data.count
            #itemlist=("items=#{encodeURIComponent(i.basic.fqin)}" for i in theitems)
            itemlist=(i.basic.fqin for i in theitems)
            biblist=(i.basic.name for i in theitems)
            bibstring = biblist.join("\n")
            sections.$bigquery.val(bibstring)
            sections.$bigqueryform.attr("action", config.bq2url)
            itemsq=itemlist.join("&")
            #$.get "#{config.itPURL}?#{itemsq}", (data)->
            #console.log "itemlist", itemlist
            syncs.taggings_postings_post_get itemlist, config.pview, (data)->
                #console.log "POSTINGS", data.postings, config.fqpn
                #console.log "TG", data.taggings
                [stags, notes]=get_taggings(data)
                tagoutput = {}
                for prop of stags
                    clist = stags[prop]
                    if clist.length==0
                        tagoutput[prop]=[]
                    else
                        tagoutput[prop] = (e[0] for e in clist)

                #console.log JSON.stringify(tagoutput)
                sections.$asjson.click (e)->
                    #data = JSON.stringify(tagoutput)
                    #window.document.write(data)
                    #alert(config.jsonPURL)
                    window.location.href = config.jsonPURL
                    e.preventDefault()
                sections.$ascsv.click (e)->
                    #data = csvstringify(tagoutput)
                    #window.document.write()
                    #console.log "data", data
                    #window.location.href = "data:text/csv;base64," + data
                    #towrite = "Content-Type: text/csv\n" + data
                    window.location.href = config.csvPURL
                    e.preventDefault()
                postings={}
                times={}
                for own k,v of data.postings
                    if v[0] > 0
                        #console.log ">>>", (e.posting for e in v[1])
                        postings[k]=[]
                        for e in v[1]
                            if e.hist.length > 1
                                for h in e.hist
                                    postings[k].push([e.posting.postfqin, h.postedby])
                            else
                                postings[k].push([e.posting.postfqin, e.posting.postedby])
                        #postings[k]=([e.posting.postfqin, e.posting.postedby] for e in v[1])
                    else
                        postings[k]=[]
                #console.log "TIMES ARE ROCKING", stags, notes, times
                # sorteditems = _.sortBy(theitems, (i) -> return -Date.parse(times[i.basic.fqin]))
                # for i in sorteditems
                #     i.whenposted = times[i.basic.fqin]
                #console.log "SORTEDITEMS"
                #for i in sorteditems
                #console.log i.basic.fqin, i.whenposted, i.whenpostedsecs
                sorteditems=theitems
                ido=
                    stags:stags
                    postings:postings
                    notes:notes
                    $el:sections.$items
                    items: sorteditems
                    noteform: true
                    nameable: false
                    itemtype:'ads/pub'
                    memberable:config.memberable
                    suggestions : suggestions
                    pview: config.pview
                    pviewowner: config.owner
                    pviewrw: config.rw
                    tagfunc: tagfunc
                plinv=new itemsdo.ItemsFilterView(ido)
                plinv.render()
                #possible A&A issue
                eb = (err) ->
                    #console.log("ERR", err)
                    for d in theitems
                        format_item(plinv.itemviews[d.basic.fqin].$('.searchresultl'),d)
                cb = (data) ->
                    #console.log "CBDATA", theitems.length, data.response.docs.length
                    thedocs = {}
                    docaltnames={}
                    enames = (d.basic.name for d in theitems)
                    for d in data.response.docs
                        thedocs[d.bibcode]=d
                        abcs = d.alternate_bibcode
                        abcs= abcs ? []
                        #console.log "ABCS", abcs
                        for e in abcs
                            if e in enames
                                docaltnames[e]=d.bibcode
                    docnames = (d.bibcode for d in data.response.docs)
                    for d in theitems
                        if d.basic.name in docnames
                            e=thedocs[d.basic.name]
                        else
                            #console.log "whoopee", d
                            e=docaltnames[d.basic.name] ? {}
                        plinv.itemviews[d.basic.fqin].e = e
                        format_item(plinv.itemviews[d.basic.fqin].$('.searchresultl'),e)
                #console.log "ITTYS", theitems, (e.basic.fqin for e in theitems)
                syncs.send_bibcodes(config.bq1url, theitems, cb, eb)
    loc = config.loc
    nonqloc=loc.href.split('?')[0]
    if sections.$ua.attr('data') is 'off'
        if nonqloc is loc.href
            urla=loc+"?userthere=true"
        else
            urla=loc+"&userthere=true"
        sections.$ua.attr('href', urla)
        sections.$ua.attr('data', 'on')
    sortdict=flip_sorter(config.querystring)
    #console.log sortdict
    #sortstring=sortdict.fout+":"+sortdict.aout
    $('#sortby').text(sortdict.ftext)
    $('#sortasc').html(sortdict.atext)
    $('#sortednow').attr("class","text-info pull-right").text("Sorted by #{sortdict.fnowtext}, #{sortdict.anowtext}.")
    $('#sortasc').click (e)->
        e.preventDefault()
        window.location=nonqloc+"?"+sortdict.oqs+"&"+'sort='+sortdict.fnow+':'+sortdict.aout
    $('#sortby').click (e)->
        e.preventDefault()
        window.location=nonqloc+"?"+sortdict.oqs+"&"+'sort='+sortdict.fout+':'+sortdict.anow

root.postablefilter =
    do_postable_info: do_postable_info
    do_postable_filter: do_postable_filter
    do_tags: do_tags
