#include<bits/stdc++.h>
using namespace std;
void start()
{
#ifndef ONLINE_JUDGE
    freopen("input.txt", "r", stdin);
    freopen("output.txt", "w", stdout);
#endif
}
class person_compare{
public:
    bool operator()(pair<string,int>p1,pair<string,int>p2){
        return p2.second>p1.second;
    }
};
int main() {
	start();
    int no_of_transactions,friends;
    cin>>no_of_transactions>>friends;
    string x,y;
    int amount;
    map<string, int>net;
    while(no_of_transactions--){
        cin>>x>>y>>amount;
        if(net.count(x)==0){
            net[x]=0;
        }
        if(net.count(y)==0){
            net[y]=0;
        }
        net[x]-=amount;
        net[y]+=amount;       
    }
    multiset<pair<string,int>,person_compare>m;
    for(auto p:net){
        string person=p.first;
        int amount=p.second;
        if(net[person]!=0){
            m.insert(make_pair(person,amount));
        }
    }
    int cnt=0;
    while(!m.empty()){
        auto low=m.begin();
        auto high=prev(m.end());
        int debit=low->second;
        string debit_person=low->first;
        int credit=high->second;
        string credit_person=high->first;
        m.erase(low);
        m.erase(high);
        int settlement_amount=min(abs(debit),credit);
        cnt++;
        debit+=settlement_amount;
        credit-=settlement_amount;
        cout<<debit_person<<" will pay "<<settlement_amount<<" to "<<credit_person<<endl;
        if(debit!=0){
            m.insert(make_pair(debit_person,debit));
        }
        if(credit!=0){
            m.insert(make_pair(credit_person,credit));
        }
    }
    cout<<cnt<<endl;
    return 0;
}