<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project architecture

- Keep profile at /profile with editable name and timezone plus guarded cancellation in an in-memory preview; why: account presentation must be testable without implying real updates or account deletion.

- Keep data retention at /data-retention as a read-only preview with policy, category totals and run history derived from a browser-safe reference model; why: plan information must remain consistent without implying account access or actual deletion.

- Keep detailed click reporting at /detailed-report with validated shortlink search parameters and one browser-safe filtered event model for metrics, charts, rankings and CSV; why: the independent preview must stay internally consistent without implying live tracking.

- Keep conversions at /conversions with client-side date/search filtering and sorting before pagination over a browser-safe demo event model; why: summaries and CSV/PDF exports must reflect the same complete filtered dataset without implying live tracking.

- Keep dashboard analytics in an editorial full-width flow; why: the primary chart and shortlink table must remain the page's visual and operational focus.
- Keep domain management at /domains with an accessible standalone creation dialog and in-memory preview data; why: domain presentation can be evaluated without implying real DNS provisioning.
- Keep API key management at /api-keys with separate creation, reveal, and deletion dialogs using in-memory preview data; why: the complete security-sensitive flow can be evaluated without implying real credentials are issued.
- Keep domain click reporting at /domain-click-report, linked from /domains, with applied domain/date filters over preview data; why: the daily report can be evaluated without implying live traffic collection.
- Keep campaign management at /campaigns with accessible dialogs, in-memory preview data and client-side ZIP exports of demo CSV links; why: the complete presentation can be evaluated without implying real redirect provisioning or traffic collection.
- Keep campaign reports at /campaign-report/$campaignId with browser-safe preview data and validated search parameters for newly created campaigns; why: each campaign has an independent report without implying live measurement or persistence.
